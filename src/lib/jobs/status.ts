import type { AnalysisJobStatus } from "@/types/analysis";

export function isActiveJobStatus(status: AnalysisJobStatus): boolean {
  return status === "queued" || status === "processing";
}

export function isTerminalJobStatus(status: AnalysisJobStatus): boolean {
  return status === "completed" || status === "failed";
}
