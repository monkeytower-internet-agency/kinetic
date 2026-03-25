import React from "react";
import { useTranslations, type Language } from "../i18n/utils";

interface Props {
  lang?: Language;
}

const Partners: React.FC<Props> = ({ lang = "de" }) => {
  const t = useTranslations(lang);
  const logos = [
    {
      src: "/assets/boxxtool_logo_new.png",
      alt: "BoxxTool",
      h: "h-16",
      href: "https://www.boxxtool.com/pages/home?bg_ref=MuaV2YzWT7",
    },
    {
      src: "/assets/Auto-Koelbl-Logo-Klein-freigestellt-e1765552310529.webp",
      alt: "Auto Kölbl",
      h: "h-20",
      href: "https://autokoelbl.de/",
    },
    {
      src: "/assets/FF_Hohenschaeftlarn.png",
      alt: "Freiwillige Feuerwehr Hohenschäftlarn e.V.",
      h: "h-24",
      href: "https://www.feuerwehr-hohenschaeftlarn.de/",
    },
    {
      src: "/assets/logo-e1456322887444.png",
      alt: "Sponsor Dietwald Klinge, Klinge Metalltechnik",
      h: "h-20",
      href: "http://klinge-metalltechnik.de/",
    },
    { src: "/assets/partner_logo.png", alt: "Boxio", h: "h-20" },
  ];

  return (
    <section className="py-20 text-center bg-body border-y border-surface-border">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-content/60 mb-10">
          {t("partners.label")}
        </p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 md:gap-8">
          {logos.map((logo, idx) => {
            const content = (
              <div
                className={`opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 p-4 ${logo.href ? "cursor-pointer" : ""}`}
                title={logo.alt}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.h} w-auto object-contain transition-transform duration-300 hover:scale-105`}
                />
              </div>
            );

            if (logo.href) {
              return (
                <a
                  key={idx}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contents"
                >
                  {content}
                </a>
              );
            }
            return <React.Fragment key={idx}>{content}</React.Fragment>;
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
