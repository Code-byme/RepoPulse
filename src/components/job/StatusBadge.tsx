import type { AnalysisJobStatus } from "@/types/analysis";

const STATUS_LABELS: Record<AnalysisJobStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

const STATUS_STYLES: Record<AnalysisJobStatus, string> = {
  queued:
    "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900/50",
  processing:
    "bg-blue-100 text-blue-900 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900/50",
  completed:
    "bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900/50",
  failed:
    "bg-red-100 text-red-900 ring-1 ring-inset ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900/50",
};

type StatusBadgeProps = {
  status: AnalysisJobStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
