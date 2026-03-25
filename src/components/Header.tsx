import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

import { useTranslations, type Language } from "../i18n/utils";

const getNavItems = (t: any, lang: Language) => {
  return [
    { label: t("nav.specs"), href: "#specs" },
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.sizing"), href: "#sizing" },
    { label: t("nav.safety"), href: "#safety" },
    { label: t("nav.media"), href: "#media" },
    { label: t("nav.faq"), href: "#faq" },
  ];
};

interface HeaderProps {
  lang?: Language;
}

const Header: React.FC<HeaderProps> = ({ lang = "de" }) => {
  const t = useTranslations(lang);
  const prefix = lang === "de" ? "" : `/${lang}`;
  const contactHref = `${prefix}/kontakt`;
  const navItems = getNavItems(t, lang);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const anchorId = href.split("#")[1];
      const el = document.getElementById(anchorId);
      if (el) {
        e.preventDefault();
        setMenuOpen(false);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // For page transitions, let the default behavior (Astro View Transitions) handle it
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-surface-border"
            : "bg-surface/40 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group relative z-50">
            <span className="text-xl font-bold tracking-tighter text-content group-hover:text-brand transition-colors">
              KINE<span className="text-brand">TIC</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="px-4 py-2 text-sm font-medium text-content/60 hover:text-content rounded-xl hover:bg-surface/50 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href={contactHref}
              onClick={(e) => handleNav(e, contactHref)}
              className="ml-2 btn-primary !px-5 !py-2 !text-sm"
            >
              {t("nav.contact")}
            </a>
            <div className="ml-4 pl-4 border-l border-surface-border">
              <ThemeSwitcher />
            </div>
          </nav>

          {/* Mobile: ThemeSwitcher + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <button
              className="p-2 rounded-xl hover:bg-surface/50 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-surface/95 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="absolute top-20 left-0 right-0 flex flex-col items-center gap-2 p-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className="w-full max-w-xs text-center px-6 py-4 text-lg font-medium text-content hover:text-brand rounded-2xl hover:bg-brand/10 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
          <a
            href={contactHref}
            onClick={(e) => handleNav(e, contactHref)}
            className="mt-4 w-full max-w-xs btn-primary font-bold"
          >
            {t("nav.contact")}
          </a>
        </nav>
      </div>
    </>
  );
};

export default Header;
