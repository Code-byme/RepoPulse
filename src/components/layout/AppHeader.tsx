import Link from "next/link";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

type AppHeaderProps = {
  active?: "home" | "repositories";
};

const NAV_LINKS = [
  { href: "/", label: "Home", key: "home" as const },
  { href: "/repositories", label: "Analyses", key: "repositories" as const },
];

export function AppHeader({ active }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface-1/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-text-primary">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent font-mono text-xs font-semibold text-[var(--on-accent)]">
            RP
          </span>
          RepoPulse
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.key;

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
