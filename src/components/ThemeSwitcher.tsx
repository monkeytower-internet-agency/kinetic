import React, { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor, Contrast, Type, RotateCcw } from "lucide-react";
import { useStore } from "@nanostores/react";
import { colorAccent, colorMode, highContrast, textSize, isInteractingWithUI } from "../stores/themeStore";

import type { ColorAccent, ColorMode } from "../stores/themeStore";


const accents: { id: ColorAccent; label: string; bgClass: string }[] = [
  { id: "verkehrsrot", label: "ProFly Red (Logo)", bgClass: "bg-[#c1121c]" },
  { id: "diva", label: "Diva", bgClass: "bg-[#BAE93D]" },
  { id: "sangry", label: "Sangry", bgClass: "bg-[#C4577D]" },
  { id: "korben", label: "Korben", bgClass: "bg-[#F19D5B]" },
  { id: "neptune", label: "Neptune", bgClass: "bg-[#6FB1CD]" },
  { id: "anthrazit", label: "Anthrazit", bgClass: "bg-[#383e42]" },
  { id: "lichtgrau", label: "Lichtgrau", bgClass: "bg-[#c5c7c4]" },
  { id: "melonengelb", label: "Melonengelb", bgClass: "bg-[#ff9b00]" },
];



const modes: { id: ColorMode; label: string; icon: React.ReactNode }[] = [
  { id: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  { id: "light", label: "Hell", icon: <Sun className="w-4 h-4" /> },
  { id: "dark", label: "Dunkel", icon: <Moon className="w-4 h-4" /> },
];

const ThemeSwitcher: React.FC = () => {
  const currentAccent = useStore(colorAccent);
  const currentMode = useStore(colorMode);
  const isHighContrast = useStore(highContrast);
  const currentTextSize = useStore(textSize);
  const [isOpen, setIsOpen] = useState(false);
  const [lockedMenuSize, setLockedMenuSize] = useState(currentTextSize);
  const ref = useRef<HTMLDivElement>(null);

  // Sync internal open state to global store to block 3D interactions
  useEffect(() => {
    isInteractingWithUI.set(isOpen);
    if (isOpen) {
      setLockedMenuSize(currentTextSize);
    }
  }, [isOpen]);



  useEffect(() => {
    // Load from localStorage on mount
    const savedAccent = localStorage.getItem(
      "theme-accent",
    ) as ColorAccent | null;
    const savedMode = localStorage.getItem("theme-mode") as ColorMode | null;
    const savedContrast = localStorage.getItem("theme-contrast") === "true";
    const savedTextSize = parseInt(localStorage.getItem("theme-text-size") || "1");

    if (savedAccent && accents.some((a) => a.id === savedAccent)) {
      colorAccent.set(savedAccent);
    }
    if (savedMode && modes.some((m) => m.id === savedMode)) {
      colorMode.set(savedMode);
    }
    highContrast.set(savedContrast);
    textSize.set(savedTextSize);
  }, []);


  useEffect(() => {
    // Apply changes to DOM
    localStorage.setItem("theme-accent", currentAccent);
    localStorage.setItem("theme-mode", currentMode);
    localStorage.setItem("theme-contrast", String(isHighContrast));
    localStorage.setItem("theme-text-size", String(currentTextSize));
    document.documentElement.setAttribute("data-brand", currentAccent);



    // Contrast
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Text Size
    const sizes = ["small", "base", "medium", "large", "xl"];
    sizes.forEach((s) => document.documentElement.classList.remove(`text-size-${s}`));
    document.documentElement.classList.add(`text-size-${sizes[currentTextSize] || "base"}`);

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
  }, [currentAccent, currentMode, isHighContrast, currentTextSize]);


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
        <div 
          className="absolute right-0 top-full mt-3 w-72 bg-surface border border-surface-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ 
            fontSize: (14 + lockedMenuSize * 2) + "px",
            lineHeight: "1.5"
          }} 
        >
          {/* Dark / Light Mode Toggle */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-content/40 mb-3 px-1 flex justify-between items-center">
              <span>Darstellung</span>
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
                      ? "bg-brand text-brand-text shadow-lg scale-[1.05]"
                      : "text-content/60 hover:text-content hover:bg-surface-border/50"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selection - RESTORED & EXTENDED */}
          <div className="pt-2 border-t border-surface-border">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-content/40 mb-4 px-1">
              Farbkonfiguration
            </div>
            <div className="grid grid-cols-5 gap-3">
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

          {/* Accessibility Section */}
          <div className="pt-2 border-t border-surface-border space-y-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-content/40 mb-3 px-1 flex justify-between items-center">
              <span>Zugänglichkeit</span>
              <button 
                onClick={() => {
                  highContrast.set(false);
                  textSize.set(1);
                }}
                className="flex items-center gap-1 text-[10px] text-brand hover:brightness-110 cursor-pointer font-bold uppercase tracking-wider"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => highContrast.set(!isHighContrast)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isHighContrast 
                  ? "bg-brand/10 border-brand text-brand ring-1 ring-brand" 
                  : "bg-body border-surface-border text-content/60 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <Contrast className="w-4 h-4" />
                Hoher Kontrast
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isHighContrast ? "bg-brand" : "bg-black/20"}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isHighContrast ? "right-1" : "left-1"}`} />
              </div>
            </button>

            {/* Text Size Selector */}
            <div className="space-y-3 bg-body p-3 rounded-xl border border-surface-border">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-content/40">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" /> Textgröße
                </div>
                <span>{["Klein", "Std.", "Mit.", "Gr.", "Max."][currentTextSize]}</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={currentTextSize}
                  onChange={(e) => textSize.set(parseInt(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}


        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
