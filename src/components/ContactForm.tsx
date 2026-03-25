import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $theme } from "../stores/themeStore";
import { Send, CheckCircle, XCircle, RefreshCcw, Loader2 } from "lucide-react";

interface ContactFormProps {
  /** Optional quiz results as a key-value object. If provided, these are sent along with the request. */
  quizResults?: Record<string, string>;
  /** Optional heading override */
  heading?: string;
  /** Optional subheading override */
  subheading?: string;
  /** Server-provided turnstile site key */
  turnstileSiteKey?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

const ContactForm: React.FC<ContactFormProps> = ({
  quizResults,
  heading = "Kontakt",
  subheading = "Schreib mir — ich melde mich persönlich.",
  turnstileSiteKey,
}) => {
  const theme = useStore($theme);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successId, setSuccessId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [uid] = useState(() => Math.random().toString(36).slice(2, 8));

  // Initialize Turnstile when the component mounts
  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setState("submitting");

    // Client-side email validation
    const emailInput = formRef.current.elements.namedItem(
      "email",
    ) as HTMLInputElement;
    const emailValue = emailInput?.value?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue || !emailRegex.test(emailValue)) {
      setState("error");
      setErrorMsg("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    try {
      const formData = new FormData(formRef.current);

      // Attach quiz results if present
      if (quizResults && Object.keys(quizResults).length > 0) {
        formData.append("quizResults", JSON.stringify(quizResults));
      }

      const response = await fetch("/api/send-mail", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setState("success");
        setSuccessId(result.id || "");
      } else {
        throw new Error(result.message || "Senden fehlgeschlagen.");
      }
    } catch (err: any) {
      setState("error");
      setErrorMsg(
        err.message ||
          "Etwas ist schief gelaufen. Bitte versuche es später erneut.",
      );
    }
  };

  const resetForm = () => {
    setState("idle");
    setErrorMsg("");
    setSuccessId("");
    formRef.current?.reset();
    // Reset Turnstile
    if ((window as any).turnstile) {
      (window as any).turnstile.reset();
    }
  };

  // --- Success State ---
  if (state === "success") {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-content">
            Nachricht gesendet!
          </h3>
          <p className="text-content/70 font-light">
            Danke für deine Anfrage – ich melde mich persönlich bei dir.
          </p>
        </div>
        {successId && (
          <p className="text-[10px] text-content/30 font-mono tracking-wider">
            Ref: {successId}
          </p>
        )}
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-6 py-3 border border-surface-border rounded-full text-sm font-medium text-content/60 hover:text-content hover:border-brand transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          Noch eine Nachricht
        </button>
      </div>
    );
  }

  // --- Error State ---
  if (state === "error") {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-content">
            Fehler beim Senden
          </h3>
          <p className="text-red-500/80">{errorMsg}</p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Erneut versuchen
        </button>
      </div>
    );
  }

  // --- Form State ---
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5"
      autoComplete="on"
    >
      {/* Honeypot */}
      <div
        className="opacity-0 absolute top-0 left-0 h-0 w-0 -z-50 pointer-events-none"
        aria-hidden="true"
      >
        <label htmlFor="bot-field">Don't fill this out if you're human:</label>
        <input
          type="text"
          name="bot-field"
          id="bot-field"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Quiz results badge */}
      {quizResults && Object.keys(quizResults).length > 0 && (
        <div className="bg-brand/10 border border-brand/40/50 rounded-2xl p-4 text-sm text-brand-text font-light">
          <span className="font-bold">Quiz-Ergebnisse</span> werden mit deiner
          Anfrage gesendet.
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label
          htmlFor={`name-${uid}`}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-content/60 ml-1"
        >
          Name *
        </label>
        <input
          type="text"
          name="name"
          id={`name-${uid}`}
          required
          autoComplete="name"
          placeholder="z.B. Max Mustermann"
          className="w-full bg-body border border-surface-border px-4 py-3 text-content rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all placeholder:text-content/30"
        />
      </div>

      {/* Email + Mobile row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor={`email-${uid}`}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-content/60 ml-1"
          >
            E-Mail *
          </label>
          <input
            type="email"
            name="email"
            id={`email-${uid}`}
            required
            autoComplete="email"
            placeholder="du@beispiel.de"
            className="w-full bg-body border border-surface-border px-4 py-3 text-content rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all placeholder:text-content/30"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor={`mobile-${uid}`}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-content/60 ml-1"
          >
            Mobilnummer
          </label>
          <input
            type="tel"
            name="mobile"
            id={`mobile-${uid}`}
            autoComplete="tel"
            placeholder="+49 177 …"
            className="w-full bg-body border border-surface-border px-4 py-3 text-content rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all placeholder:text-content/30"
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label
          htmlFor={`message-${uid}`}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-content/60 ml-1"
        >
          Nachricht
        </label>
        <textarea
          name="message"
          id={`message-${uid}`}
          rows={4}
          placeholder="Erzähl mir von deinem Projekt…"
          className="w-full bg-body border border-surface-border px-4 py-3 text-content rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all resize-none placeholder:text-content/30"
        />
      </div>

      {/* Turnstile */}
      <div className="flex justify-center py-1">
        <div
          className="cf-turnstile"
          data-sitekey={
            turnstileSiteKey || import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || ""
          }
          data-theme={theme === "dark" ? "dark" : "light"}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full btn-primary"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sende…
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Nachricht senden
          </>
        )}
      </button>

      <div className="text-center">
        <span className="text-xs text-content/60 font-light italic">
          Alternativ:{" "}
          <a
            href="mailto:info@profly.org"
            className="text-brand hover:text-brand-hover transition-colors underline underline-offset-4"
          >
            Direkt eine Mail schreiben
          </a>
        </span>
      </div>
    </form>
  );
};

export default ContactForm;
