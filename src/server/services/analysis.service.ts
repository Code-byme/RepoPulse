import { inngest } from "@/lib/inngest/client";
import { ANALYZE_REPOSITORY_EVENT } from "@/lib/inngest/events";
import { parseSubmitRepoInput } from "@/lib/validators/repo-submission";
import { ServiceError } from "@/server/errors";
import {
  createAnalysisJob,
  findActiveAnalysisJobByRepositoryId,
  findAnalysisJobById,
  updateAnalysisJobStatus,
} from "@/server/repositories/analysis-job.repository";
import { toAnalysisJob } from "@/server/mappers/analysis-job.mapper";
import { findOrCreateRepository } from "@/server/services/repository.service";
import type {
  AnalysisJobDetailResponse,
  SubmitAnalysisResponse,
} from "@/types/api";

function toAnalysisJobDetailResponse(
  job: ReturnType<typeof toAnalysisJob>,
): AnalysisJobDetailResponse {
  return {
    jobId: job.id,
    repositoryId: job.repositoryId,
    status: job.status,
    errorMessage: job.errorMessage,
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export async function submitRepositoryForAnalysis(
  input: unknown,
): Promise<SubmitAnalysisResponse> {
  const { repoUrl } = parseSubmitRepoInput(input);
  const repository = await findOrCreateRepository(repoUrl);

  const activeJob = await findActiveAnalysisJobByRepositoryId(repository.id);

  if (activeJob) {
    return {
      jobId: activeJob.id,
      repositoryId: repository.id,
      status: activeJob.status,
    };
  }

  const jobRow = await createAnalysisJob({
    repositoryId: repository.id,
    status: "queued",
  });

  try {
    await inngest.send({
      name: ANALYZE_REPOSITORY_EVENT,
      data: {
        jobId: jobRow.id,
        repositoryId: repository.id,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to enqueue analysis job";

    await updateAnalysisJobStatus(jobRow.id, "failed", {
      errorMessage: message,
      completedAt: new Date(),
    });

    throw new ServiceError(`Failed to enqueue analysis job: ${message}`, 502);
  }

  return {
    jobId: jobRow.id,
    repositoryId: repository.id,
    status: "queued",
  };
}

export async function getAnalysisJobById(
  jobId: string,
): Promise<AnalysisJobDetailResponse | null> {
  const jobRow = await findAnalysisJobById(jobId);

  if (!jobRow) {
    return null;
  }

  return toAnalysisJobDetailResponse(toAnalysisJob(jobRow));
}
