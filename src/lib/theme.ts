export const THEME_STORAGE_KEY = "repopulse-theme";

export type Theme = "dark" | "light";

export function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);var theme=t==="light"||t==="dark"?t:"dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(theme);document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}})();`;
