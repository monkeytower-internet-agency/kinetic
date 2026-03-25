import React from "react";
import { QrCode, Phone, Mail, Globe } from "lucide-react";
import { useTranslations, type Language } from "../i18n/utils";

interface ContactCardProps {
  lang?: Language;
}

const ContactCard: React.FC<ContactCardProps> = ({ lang = "de" }) => {
  const t = useTranslations(lang);
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Olaf Klein
ORG:ProFly
TEL;TYPE=CELL:+491772688999
EMAIL:info@profly.org
URL:https://profly.org
END:VCARD`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vcard)}`;

  return (
    <div className="h-full bg-surface rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-surface-border p-8 pt-16 flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-content">
          {t("contact.card.title")}
        </h3>
        <p className="text-sm text-content/60 font-light">
          {t("contact.card.desc")}
        </p>
      </div>

      <div className="relative p-4 bg-body rounded-2xl border border-surface-border">
        <img
          src={qrUrl}
          alt="Contact QR Code"
          className="w-40 h-40 object-contain"
          loading="lazy"
        />
        <div className="absolute -bottom-2 -right-2 bg-brand text-white p-2 rounded-lg shadow-lg">
          <QrCode className="w-4 h-4" />
        </div>
      </div>

      <div className="w-full space-y-3 pt-2">
        <a
          href="tel:+491772688999"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-body transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-content/70">
            +49 177 26 88 999
          </span>
        </a>
        <a
          href="mailto:info@profly.org"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-body transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-content/70">
            info@profly.org
          </span>
        </a>
        <div className="flex items-center gap-3 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-body flex items-center justify-center text-content/40">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-content/70">
            profly.org
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
