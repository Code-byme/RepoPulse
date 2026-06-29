import type { AnalysisJobStatus } from "@/types/analysis";

const STATUS_LABELS: Record<AnalysisJobStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

const STATUS_CLASSES: Record<AnalysisJobStatus, string> = {
  queued: "rp-status-pill rp-status-pill--queued",
  processing: "rp-status-pill rp-status-pill--processing",
  completed: "rp-status-pill rp-status-pill--completed",
  failed: "rp-status-pill rp-status-pill--failed",
};

type StatusBadgeProps = {
  status: AnalysisJobStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={STATUS_CLASSES[status]}>
      <span className="rp-status-dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
