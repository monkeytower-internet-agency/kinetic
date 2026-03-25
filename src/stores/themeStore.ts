import { atom, computed } from 'nanostores';

export type ColorAccent = "verkehrsrot" | "diva" | "sangry" | "korben" | "neptune";
export type ColorMode = "light" | "dark" | "system";

export const colorAccent = atom<ColorAccent>("verkehrsrot");


export const colorMode = atom<ColorMode>("system");
export const highContrast = atom<boolean>(false);
export const textSize = atom<number>(1); // 0 = Small, 1 = Default, 2 = Medium, 3 = Large, 4 = Extra Large
export const isInteractingWithUI = atom<boolean>(false);


// Computed store to resolve the actual theme (light or dark)
export const $theme = computed(colorMode, (mode) => {
  if (mode !== "system") return mode;
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light"; // Default for SSR
});
