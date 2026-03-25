import React, { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor, Contrast, Type, RotateCcw } from "lucide-react";
import { useStore } from "@nanostores/react";
import { colorAccent, colorMode, highContrast, textSize, isInteractingWithUI } from "../stores/themeStore";

import type { ColorAccent, ColorMode } from "../stores/themeStore";


const accents: { id: ColorAccent; label: string; bgClass: string }[] = [
  { id: "verkehrsrot", label: "ProFly Ruby", bgClass: "bg-[#c1121c]" },
  { id: "diva", label: "Diva", bgClass: "bg-[#BAE93D]" },
  { id: "sangry", label: "Sangry", bgClass: "bg-[#C4577D]" },
  { id: "korben", label: "Korben", bgClass: "bg-[#F19D5B]" },
  { id: "neptune", label: "Neptune", bgClass: "bg-[#6FB1CD]" },
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
    const savedTextSize = parseInt(localStorage.getItem("theme-text-size") || "2");


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

            <div className="text-[11px] font-bold tracking-tight text-content/40 mb-3 px-1 flex justify-between items-center">
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
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    currentMode === m.id
                      ? isHighContrast 
                        ? "bg-white text-black ring-2 ring-white scale-110" 
                        : "bg-brand text-brand-text shadow-lg scale-[1.05]"
                      : isHighContrast 
                        ? "text-white opacity-50 border border-white/20" 
                        : "text-content/60 hover:text-content hover:bg-surface-border/50"
                  }`}

                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selection - ProFly Colors */}
          <div className="pt-2 border-t border-surface-border">
            <div className="text-[11px] font-bold tracking-tight text-content/40 mb-4 px-1">
              ProFly colors
            </div>
            <div className="grid grid-cols-5 gap-4">
              {accents.map((a) => (
                <div key={a.id} className="flex flex-col items-center gap-1.5 opacity-100! group">
                  <button
                    type="button"
                    onClick={() => colorAccent.set(a.id)}
                    title={a.label}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-10 ${
                      currentAccent === a.id ? "scale-105" : ""
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full shadow-inner border border-surface-border ${a.bgClass}`}
                    />
                    {currentAccent === a.id && (
                      <div className="absolute -inset-1 rounded-full border-2 border-brand" />
                    )}
                  </button>
                  <span className={`text-[9px] font-bold tracking-tight text-center transition-colors ${currentAccent === a.id ? "text-brand" : "text-content/40 group-hover:text-content"}`}>
                    {a.label}
                  </span>

                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Section */}
          <div className="pt-2 border-t border-surface-border space-y-4">
            <div className="text-[11px] font-bold tracking-tight text-content/40 mb-3 px-1 flex justify-between items-center opacity-100!">
              <span>Konfiguration</span>
              <button 
                onClick={() => {
                  highContrast.set(false);
                  textSize.set(1);
                }}
                className="flex items-center gap-1 text-[10px] text-brand hover:brightness-110 cursor-pointer font-medium tracking-tight"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => highContrast.set(!isHighContrast)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isHighContrast 
                  ? "bg-white text-black border-white ring-2 ring-white" 
                  : "bg-body border-surface-border text-content/60 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs tracking-tight opacity-100!">
                <Contrast className="w-4 h-4" />
                High Contrast
              </div>
              <div 
                className={`w-10 h-5 rounded-full relative transition-colors border ${
                  isHighContrast ? "bg-brand border-white" : "bg-black/40 border-surface-border"
                }`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all border ${
                  isHighContrast ? "right-1 bg-white border-white" : "left-1 bg-white border-transparent"
                }`} />
              </div>

            </button>


            {/* Text Size Selector - Glider Sizing Icons/Buttons */}
            <div className="space-y-3 bg-body p-3 rounded-xl border border-surface-border">
              <div className="text-[11px] font-bold tracking-tight text-content/40 mb-2 opacity-100!">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" /> Size
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1 bg-surface p-1 rounded-lg">
                {["XS", "S", "M", "L", "XL"].map((sizeLabel, idx) => (
                    <button
                     key={sizeLabel}
                     onClick={() => textSize.set(idx)}
                     className={`py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                       currentTextSize === idx
                         ? isHighContrast 
                           ? "bg-white text-black border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                           : "bg-brand text-brand-text border-brand shadow-sm scale-110"
                         : isHighContrast 
                           ? "text-white/60 border-white/20 hover:border-white/50" 
                           : "text-content/60 border-transparent hover:bg-surface-border"
                     }`}

                    >
                      {sizeLabel}
                    </button>

                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};


export default ThemeSwitcher;
