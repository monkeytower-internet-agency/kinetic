import type { APIRoute } from "astro";
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";

// Force server-side functionality
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  // 1. Invisible Honeypot Security
  const botField = data.get("bot-field");
  if (botField) {
    // Silently success for bots (Shadowban)
    return new Response(
      JSON.stringify({ message: "Message sent successfully." }),
      { status: 200 }
    );
  }

  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const mobile = data.get("mobile") as string;
  const message = data.get("message") as string;
  const quizResults = data.get("quizResults") as string; // Optional field for quiz data

  if (!name || !email) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Name und Email sind Pflichtfelder." 
      }), 
      { status: 400 }
    );
  }

  try {
    const clientId = import.meta.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = import.meta.env.GOOGLE_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
    const user = import.meta.env.EMAIL_USER || process.env.EMAIL_USER;
    const from = import.meta.env.EMAIL_FROM || process.env.EMAIL_FROM || user;
    const to = import.meta.env.EMAIL_TO || process.env.EMAIL_TO || user;

    if (!clientId || !clientSecret || !refreshToken || !user || !to) {
      console.error("Missing Environment Variables for Email Service");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Server Konfigurationsfehler: Fehlende Zugangsdaten.",
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // 1.5. Validate Cloudflare Turnstile (if provided)
    const turnstileToken = data.get("cf-turnstile-response") as string;
    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret && turnstileToken) {
      const turnstileVerify = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        }
      );

      const turnstileResult = await turnstileVerify.json();
      if (!turnstileResult.success) {
        return new Response(
            JSON.stringify({ success: false, message: "Human verification failed." }), 
            { status: 400 }
        );
      }
    }

    // 2. Authenticate with Gmail
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    // 3. Construct Email Body
    let textBody = `Anfrage von: ${name}\nEmail: ${email}\n`;
    if (mobile) textBody += `Mobil: ${mobile}\n`;
    textBody += `\nNachricht:\n${message || '(Keine Nachricht hinterlassen)'}\n`;

    let htmlBody = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #f97316;">Neue Anfrage von ParaNomad.de</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${mobile ? `<p><strong>Mobil:</strong> ${mobile}</p>` : ''}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
        <p><strong>Nachricht:</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message || '<i>Keine Nachricht hinterlassen</i>'}</p>
    `;

    if (quizResults) {
        try {
            const results = JSON.parse(quizResults);
            textBody += `\n--- Quiz Ergebnisse ---\n${Object.entries(results).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
            htmlBody += `
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                <h3 style="color: #666;">Quiz Ergebnisse</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${Object.entries(results).map(([k, v]) => `
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 40%;">${k}</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${v}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
        } catch (e) {
            console.error("Failed to parse quiz results", e);
        }
    }

    htmlBody += `
        <div style="margin-top: 30px; font-size: 10px; color: #999; text-align: center;">
            Gesendet von ParaNomad.de Kontaktformular
        </div>
      </div>
    `;

    // 4. Construct MIME Message
    const mail = new MailComposer({
      from: `"ParaNomad" <${from}>`,
      to: to,
      replyTo: email,
      subject: `[ParaNomad] Neue Anfrage von ${name}`,
      text: textBody,
      html: htmlBody,
    });

    const messageBuffer = await mail.compile().build();
    const encodedMessage = messageBuffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 5. Send via Gmail API
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    // 6. Success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully!",
        id: result.data.id,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Email Send Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error.message || "Fehler beim Senden der Email. Bitte versuchen Sie es später erneut.",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
