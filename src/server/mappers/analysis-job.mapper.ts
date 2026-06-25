import type { AnalysisJobRow } from "@/lib/db/schema";
import type { AnalysisJob } from "@/types/job";

export function toAnalysisJob(row: AnalysisJobRow): AnalysisJob {
  return {
    id: row.id,
    repositoryId: row.repositoryId,
    status: row.status,
    inngestRunId: row.inngestRunId,
    errorMessage: row.errorMessage,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
