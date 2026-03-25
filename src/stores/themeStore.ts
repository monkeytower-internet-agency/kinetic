import { atom, computed } from 'nanostores';

export type ColorAccent = "melonengelb" | "klartuerkis" | "maerzgruen" | "verkehrsrot" | "hellgrau" | "anthrazit";
export type ColorMode = "light" | "dark" | "system";

export const colorAccent = atom<ColorAccent>("melonengelb");
export const colorMode = atom<ColorMode>("system");

// Computed store to resolve the actual theme (light or dark)
export const $theme = computed(colorMode, (mode) => {
  if (mode !== "system") return mode;
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light"; // Default for SSR
});
