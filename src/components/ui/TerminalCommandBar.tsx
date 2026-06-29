import Link from "next/link";

type TerminalCommandBarProps = {
  repoFullName: string;
  backHref?: string;
};

export function TerminalCommandBar({
  repoFullName,
  backHref,
}: TerminalCommandBarProps) {
  return (
    <div className="rp-terminal">
      <div className="rp-terminal-header">
        <div className="rp-terminal-dots" aria-hidden="true">
          <span className="rp-terminal-dot" />
          <span className="rp-terminal-dot" />
          <span className="rp-terminal-dot" />
        </div>
        <span className="rp-terminal-title">repopulse — analysis session</span>
      </div>
      <div className="rp-terminal-body">
        {backHref ? (
          <Link href={backHref} className="rp-link mr-1 text-xs">
            ←
          </Link>
        ) : null}
        <span className="rp-terminal-prompt">$</span>
        <span className="rp-terminal-command">
          repopulse analyze {repoFullName}
        </span>
        <span className="rp-terminal-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
