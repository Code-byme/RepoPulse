"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.5M10 16v1.5M3.5 10H2M18 10h-1.5M5.05 5.05l-1.06-1.06M15.01 15.01l-1.06-1.06M14.95 5.05l1.06-1.06M5.99 15.01l1.06-1.06" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14.5 12.2a5.5 5.5 0 0 1-6.7-6.7 5.5 5.5 0 1 0 6.7 6.7Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
