import { NotFoundError } from "@/server/errors";
import { toAnalysisJob } from "@/server/mappers/analysis-job.mapper";
import {
  toAnalysisJobHistoryItem,
  toAnalysisJobSummaryResponse,
  toAnalysisResultResponse,
  toRepositoryResponse,
} from "@/server/mappers/api.mapper";
import { toStoredAnalysisResult } from "@/server/mappers/analysis-result.mapper";
import { toRepository } from "@/server/mappers/repository.mapper";
import {
  findAnalysisJobsByRepositoryId,
  findLatestAnalysisJobByRepositoryId,
} from "@/server/repositories/analysis-job.repository";
import { findLatestCompletedAnalysisResultByRepositoryId } from "@/server/repositories/analysis-result.repository";
import { findRepositoryById } from "@/server/repositories/repository.repository";
import type {
  RepositoryDetailResponse,
  RepositoryReportResponse,
} from "@/types/api";

export async function getRepositoryWithLatestJob(
  repositoryId: string,
): Promise<RepositoryDetailResponse> {
  const repositoryRow = await findRepositoryById(repositoryId);

  if (!repositoryRow) {
    throw new NotFoundError("Repository not found");
  }

  const repository = toRepository(repositoryRow);
  const latestJobRow = await findLatestAnalysisJobByRepositoryId(repositoryId);
  const latestJob = latestJobRow ? toAnalysisJob(latestJobRow) : null;

  return {
    repository: toRepositoryResponse(repository),
    latestJob: latestJob ? toAnalysisJobSummaryResponse(latestJob) : null,
    latestStatus: latestJob?.status ?? null,
  };
}

export async function getRepositoryReportByRepositoryId(
  repositoryId: string,
): Promise<RepositoryReportResponse> {
  const repositoryRow = await findRepositoryById(repositoryId);

  if (!repositoryRow) {
    throw new NotFoundError("Repository not found");
  }

  const repository = toRepository(repositoryRow);
  const [resultRow, jobRows] = await Promise.all([
    findLatestCompletedAnalysisResultByRepositoryId(repositoryId),
    findAnalysisJobsByRepositoryId(repositoryId),
  ]);

  const jobHistory = jobRows.map((row) =>
    toAnalysisJobHistoryItem(toAnalysisJob(row)),
  );

  if (!resultRow) {
    return {
      repository: toRepositoryResponse(repository),
      status: "incomplete",
      report: null,
      jobHistory,
      message: buildIncompleteReportMessage(jobHistory),
    };
  }

  const report = toAnalysisResultResponse(toStoredAnalysisResult(resultRow));

  return {
    repository: toRepositoryResponse(repository),
    status: "complete",
    report,
    jobHistory,
    message: null,
  };
}

function buildIncompleteReportMessage(
  jobHistory: RepositoryReportResponse["jobHistory"],
): string {
  if (jobHistory.length === 0) {
    return "No analysis jobs have been submitted for this repository yet.";
  }

  const latestJob = jobHistory[0];

  if (!latestJob) {
    return "No completed analysis report is available yet.";
  }

  if (latestJob.status === "queued") {
    return "Analysis is queued and has not started yet.";
  }

  if (latestJob.status === "processing") {
    return "Analysis is currently in progress.";
  }

  if (latestJob.status === "failed") {
    return "The latest analysis job failed before a report could be generated.";
  }

  return "No completed analysis report is available yet.";
}
