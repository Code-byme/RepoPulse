type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

function getStatValueClass(label: string, value: string | number): string {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("language")) {
    return "rp-stat-value rp-stat-value--blue";
  }

  if (normalizedLabel.includes("todo")) {
    return "rp-stat-value rp-stat-value--accent";
  }

  if (
    normalizedLabel.includes("repository") ||
    normalizedLabel.includes("architecture")
  ) {
    return "rp-stat-value rp-stat-value--mono";
  }

  return "rp-stat-value";
}

export function StatCard({ label, value, hint }: StatCardProps) {
  const stringValue = String(value);
  const isSignal = stringValue === "Yes" || stringValue === "No";
  const isPositive = stringValue === "Yes";

  if (isSignal) {
    return (
      <div
        className={`rp-signal ${isPositive ? "rp-signal--positive" : "rp-signal--negative"}`}
      >
        <span className="rp-signal-label">
          <span
            className={
              isPositive ? "rp-signal-mark--positive" : "rp-signal-mark--negative"
            }
          >
            {isPositive ? "+" : "-"}
          </span>
          {label}
        </span>
        <span
          className={
            isPositive ? "rp-signal-value--positive" : "rp-signal-value--negative"
          }
        >
          {stringValue}
        </span>
      </div>
    );
  }

  return (
    <div className="rp-stat">
      <p className="rp-stat-label">{label}</p>
      <p className={getStatValueClass(label, value)}>{value}</p>
      {hint ? <p className="rp-stat-hint">{hint}</p> : null}
    </div>
  );
}
