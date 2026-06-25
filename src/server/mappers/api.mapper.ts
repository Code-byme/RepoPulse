import type { AnalysisJob } from "@/types/job";
import type { Repository } from "@/types/repository";
import type {
  AnalysisJobHistoryItem,
  AnalysisJobSummaryResponse,
  AnalysisResultResponse,
  RepositoryResponse,
} from "@/types/api";
import type { StoredAnalysisResult } from "@/server/mappers/analysis-result.mapper";

export function toRepositoryResponse(repository: Repository): RepositoryResponse {
  return {
    id: repository.id,
    owner: repository.owner,
    name: repository.name,
    fullName: repository.fullName,
    githubUrl: repository.githubUrl,
    defaultBranch: repository.defaultBranch,
    lastAnalyzedAt: repository.lastAnalyzedAt?.toISOString() ?? null,
    createdAt: repository.createdAt.toISOString(),
    updatedAt: repository.updatedAt.toISOString(),
  };
}

export function toAnalysisJobSummaryResponse(
  job: AnalysisJob,
): AnalysisJobSummaryResponse {
  return {
    jobId: job.id,
    status: job.status,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    completedAt: job.completedAt?.toISOString() ?? null,
  };
}

export function toAnalysisJobHistoryItem(
  job: AnalysisJob,
): AnalysisJobHistoryItem {
  return {
    jobId: job.id,
    status: job.status,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
  };
}

export function toAnalysisResultResponse(
  result: StoredAnalysisResult,
): AnalysisResultResponse {
  return {
    resultId: result.id,
    jobId: result.jobId,
    summary: result.summary,
    report: result.report,
    createdAt: result.createdAt.toISOString(),
  };
}
