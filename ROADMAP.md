# ParaNomad — Roadmap

> Stand: 19.02.2026 | Status der Seite: ✅ Live auf paranomad.de

---

## ✅ Sprint 1 (Done) — Foundation & Funnel

- [x] Astro + React Grundstruktur
- [x] Hero mit animierter RotatingHeadline
- [x] Quiz-Funnel (6 Schritte, dynamisch, personalisiertes Ergebnis)
- [x] Flip-Card Grid (Pain Points → Lösungen)
- [x] Kontaktformular mit Quiz-Ergebnis-Übergabe (Resend)
- [x] Partner-Sektion
- [x] Impressum + Datenschutz
- [x] Coolify Deployment auf Magrathea
- [x] DNS paranomad.de → Let's Encrypt SSL

---

## 🔜 Sprint 2 — Lead-Quali & Conversion Vertiefung

### 2.1 Demo-Würfel Lead-Magnet (hohe Priorität!)
> **Idee:** Echter 6-Paneel-Demo-Würfel physisch zusenden gegen Aufwandspauschale (z.B. 19 €).
> Diese Schwelle ist bewusst niedrig, aber nicht null — sie filtert echte Interessenten von Schaulustigen.

**Umsetzung:**
- [ ] Neuer Funnel-Schritt nach Quiz-Auswertung: "Du willst es anfassen?" CTA
- [ ] Formular: Name, Adresse, Betrag → Stripe/PayPal (oder manuell zu Beginn)
- [ ] Datenbank: PostgreSQL auf Supabase (bereits im DALM-Stack vorhanden!)
  - Tabelle: `leads` mit Quiz-Ergebnis, Kontaktdaten, Demo-Status
- [ ] Automatisierung: N8N Workflow
  - Trigger: Formular-Submit
  - Action: Lead in DB → Bestätigungsmail (Resend) → Olaf Notification

### 2.2 LLM-Chat-Modul nach Quiz (N8N)
> **Idee:** Nach der Auswertung: "Ich habe noch Fragen →" öffnet einen Chat.
> Das LLM kennt bereits das Quiz-Ergebnis als System-Prompt → hochpersonalisierte Beratung.

**Architektur:**
- [ ] Frontend: Kleines Chat-Widget (React, am Ende der Result-Card)
- [ ] Backend: N8N Webhook → OpenAI / Gemini API
- [ ] System-Prompt: Enthält Quiz-Antworten (status, vehicle, usage, needs, concern)
- [ ] Abschluss: Chat → "Soll ich dir das schicken?" → E-Mail-Capture → Mailing-Liste

**Stack:** N8N (schon live auf DALM), Resend (bereits integriert), PostgreSQL (Supabase)

### 2.3 Lead-Magnet PDF (Mailing-Liste)
> **Idee:** "Camper Plan Guide" PDF — individuell generiert aus Quiz-Antworten.
> Klassischer Sales-Funnel, aber mit personalisierten Daten → fühlt sich nicht generisch an.

**Flow:**
```
Quiz-Ende → "Noch unsicher?"
  → PDF: "Dein Ausbau-Plan für [Fahrzeug-Typ]"
  → E-Mail eingeben → N8N: PDF generieren + versenden + in Liste eintragen
```

- [ ] 3-4 PDF-Templates (nach Fahrzeug-Kategorie)
- [ ] N8N: PDF aus Template + Variablen zusammenbauen
- [ ] Mailing-Liste: Mailchimp / Loops.so / selbstgehostet

---

## 🔭 Sprint 3 — Content & SEO

- [ ] Blog/Content: Ausbau-Guides, Fahrzeug-Reviews (Olaf schreibt, AGY strukturiert)
- [ ] SEO: Meta-Tags, strukturierte Daten (Schema.org), sitemap.xml
- [ ] Testimonials-Sektion (erste Kunden-Fotos einbinden)
- [ ] Galerie: Echte Ausbau-Fotos von Projekten

---

## 💡 Backlog / Ideen-Pool

- Analytics: Plausible (self-hosted, DSGVO-konform, auf DALM)
- A/B-Test: Quiz-Startfrage (Status vs. Traum-Frage)
- Kalender-Integration: Direkte Terminbuchung nach Quiz (Cal.com)
- Referral-System: "Empfehle ParaNomad, kriege Rabatt auf Versandkosten"

---

*Diese Roadmap wird im Repo gepflegt. Nächster Review: nach Sprint 2 Start.*
