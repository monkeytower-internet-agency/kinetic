import React, { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useStore } from "@nanostores/react";
import { colorAccent, colorMode } from "../stores/themeStore";
import type { ColorAccent, ColorMode } from "../stores/themeStore";

const accents: { id: ColorAccent; label: string; bgClass: string }[] = [
  { id: "melonengelb", label: "Melonengelb", bgClass: "bg-[#ff9b00]" },
  { id: "klartuerkis", label: "Klartürkis", bgClass: "bg-[#0b8a81]" },
  { id: "maerzgruen", label: "Märzgrün", bgClass: "bg-[#add400]" },
  { id: "verkehrsrot", label: "Verkehrsrot", bgClass: "bg-[#c1121c]" },
  { id: "hellgrau", label: "Hellgrau", bgClass: "bg-[#c5c7c4]" },
  { id: "anthrazit", label: "Anthrazit", bgClass: "bg-[#383e42]" },
];

const modes: { id: ColorMode; label: string; icon: React.ReactNode }[] = [
  { id: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  { id: "light", label: "Hell", icon: <Sun className="w-4 h-4" /> },
  { id: "dark", label: "Dunkel", icon: <Moon className="w-4 h-4" /> },
];

const ThemeSwitcher: React.FC = () => {
  const currentAccent = useStore(colorAccent);
  const currentMode = useStore(colorMode);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedAccent = localStorage.getItem(
      "boxxtool-accent",
    ) as ColorAccent | null;
    const savedMode = localStorage.getItem("boxxtool-mode") as ColorMode | null;

    if (savedAccent && accents.some((a) => a.id === savedAccent)) {
      colorAccent.set(savedAccent);
    }
    if (savedMode && modes.some((m) => m.id === savedMode)) {
      colorMode.set(savedMode);
    }
  }, []);

  useEffect(() => {
    // Apply changes to DOM
    localStorage.setItem("boxxtool-accent", currentAccent);
    localStorage.setItem("boxxtool-mode", currentMode);

    document.documentElement.setAttribute("data-brand", currentAccent);

    const applyDarkMode = () => document.documentElement.classList.add("dark");
    const applyLightMode = () =>
      document.documentElement.classList.remove("dark");

    if (currentMode === "dark") {
      applyDarkMode();
    } else if (currentMode === "light") {
      applyLightMode();
    } else {
      // System
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        applyDarkMode();
      } else {
        applyLightMode();
      }
    }
  }, [currentAccent, currentMode]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const MainIcon =
    currentMode === "system" ? Monitor : currentMode === "dark" ? Moon : Sun;

  return (
    <div className="relative z-50" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="p-2.5 rounded-xl text-content/60 hover:text-brand hover:bg-brand/10 transition-all flex items-center justify-center relative shadow-sm border border-transparent hover:border-surface-border cursor-pointer"
        aria-label="Theme wechseln"
        aria-expanded={isOpen}
      >
        <MainIcon className="w-5 h-5 transition-transform duration-500 hover:rotate-12" />
        {currentMode === "system" && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown Menu — click-controlled, not hover-only */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-surface border border-surface-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Dark / Light Mode Toggle */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-content/40 mb-3 px-1 flex justify-between items-center">
              <span>Optionen</span>
              <span className="text-content/30 font-normal lowercase tracking-normal">
                {currentMode === "system" ? "System" : currentMode}
              </span>
            </div>
            <div className="flex bg-body p-1.5 rounded-[1rem] gap-1">
              {modes.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => colorMode.set(m.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    currentMode === m.id
                      ? "bg-brand text-white shadow-lg scale-[1.05]"
                      : "text-content/60 hover:text-content hover:bg-surface-border/50"
                  }`}
                >
                  <span
                    className={currentMode === m.id ? "text-brand-text" : ""}
                  >
                    {m.icon}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="pt-2 border-t border-surface-border">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-content/40 mb-4 px-1">
              Boxxtool Farbe
            </div>
            <div className="grid grid-cols-6 gap-3">
              {accents.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => colorAccent.set(a.id)}
                  title={a.label}
                  className={`relative aspect-square rounded-full flex items-center justify-center transition-transform hover:scale-125 cursor-pointer z-10 ${
                    currentAccent === a.id ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full shadow-inner border border-surface-border ${a.bgClass} transition-transform duration-300 hover:-rotate-12`}
                  />
                  {currentAccent === a.id && (
                    <div className="absolute -inset-1 rounded-full border-2 border-brand" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
