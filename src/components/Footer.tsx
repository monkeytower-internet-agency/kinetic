import React from "react";
import { useTranslations, type Language } from "../i18n/utils";

interface Props {
  lang?: Language;
}

const Footer: React.FC<Props> = ({ lang = "de" }) => {
  const t = useTranslations(lang);

  return (
    <footer className="py-12 px-8 border-t border-surface-border bg-surface/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-10">
          <img 
            src="/assets/logo-kinetic-white.png" 
            alt="KINETIC" 
            className="h-6 w-auto opacity-80"
          />
        </div>
        <div className="flex gap-8 text-xs font-medium text-content/60 mb-8 uppercase tracking-widest">
          <a
            href="/datenschutz"
            className="hover:text-content transition-colors"
          >
            {t("footer.privacy")}
          </a>
          <a href="/impressum" className="hover:text-content transition-colors">
            {t("footer.imprint")}
          </a>
        </div>
        <p className="text-[10px] text-content/40 font-medium">
          © {new Date().getFullYear()} ProFly. {t("footer.tagline")}
        </p>
        <p className="text-[9px] text-content/30 mt-1 font-mono opacity-50">
          v{new Date().toISOString().slice(0, 16).replace("T", " ")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
