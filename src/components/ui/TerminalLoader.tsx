"use client";

import { useEffect, useState } from "react";

interface TerminalLoaderProps {
  command: string;
  steps: string[];
  className?: string;
}

export function TerminalLoader({ command, steps, className = "" }: TerminalLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (steps.length <= 1) return;
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      className={`w-full max-w-md rounded-lg border border-border bg-surface-1 overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="ml-1.5 text-xs text-text-muted">repopulse — analysis session</span>
      </div>

      <div className="px-4 py-4 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green">$</span>
          <span className="text-text-primary">{command}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-text-secondary">
          <span className="text-accent">›</span>
          <span key={stepIndex} className="animate-fadeIn">
            {steps[stepIndex]}
          </span>
          <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-blink bg-accent" />
        </div>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-1/3 animate-loadingBar rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}