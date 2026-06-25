import {
  findAnalysisJobById,
  updateAnalysisJobStatus,
} from "@/server/repositories/analysis-job.repository";
import {
  createAnalysisResultIfNotExists,
  findAnalysisResultByJobId,
} from "@/server/repositories/analysis-result.repository";
import {
  findRepositoryById,
  updateRepositoryDefaultBranch,
  updateRepositoryLastAnalyzedAt,
} from "@/server/repositories/repository.repository";
import { toAnalysisResultInsert } from "@/server/mappers/analysis-result.mapper";
import { classifyAnalysisError } from "@/lib/github/errors";
import { executeGithubAnalysis } from "@/server/services/github-analysis.service";
import type { AnalysisReport } from "@/types/github-analysis";

export type AnalyzeRepositoryWorkflowInput = {
  jobId: string;
  repositoryId: string;
  inngestRunId?: string;
};

export type AnalyzeRepositoryWorkflowResult = {
  status: "completed" | "skipped" | "failed";
  jobId: string;
};

export async function markAnalysisJobProcessing(
  jobId: string,
  inngestRunId?: string,
): Promise<void> {
  await updateAnalysisJobStatus(jobId, "processing", {
    inngestRunId,
    startedAt: new Date(),
    errorMessage: null,
  });
}

export async function markAnalysisJobFailed(
  jobId: string,
  errorMessage: string,
): Promise<void> {
  await updateAnalysisJobStatus(jobId, "failed", {
    errorMessage,
    completedAt: new Date(),
  });
}

export async function markAnalysisJobCompleted(jobId: string): Promise<void> {
  await updateAnalysisJobStatus(jobId, "completed", {
    completedAt: new Date(),
    errorMessage: null,
  });
}

export async function saveAnalysisReport(
  jobId: string,
  repositoryId: string,
  report: AnalysisReport,
): Promise<void> {
  await createAnalysisResultIfNotExists(
    toAnalysisResultInsert(jobId, repositoryId, report),
  );
}

export async function runAnalyzeRepositoryWorkflow(
  input: AnalyzeRepositoryWorkflowInput,
): Promise<AnalyzeRepositoryWorkflowResult> {
  const { jobId, repositoryId, inngestRunId } = input;

  const job = await findAnalysisJobById(jobId);

  if (!job) {
    return { status: "failed", jobId };
  }

  if (job.status === "completed") {
    const existingResult = await findAnalysisResultByJobId(jobId);

    if (existingResult) {
      return { status: "skipped", jobId };
    }
  }

  if (
    job.status === "processing" &&
    job.inngestRunId &&
    inngestRunId &&
    job.inngestRunId !== inngestRunId
  ) {
    return { status: "skipped", jobId };
  }

  const repository = await findRepositoryById(repositoryId);

  if (!repository) {
    await markAnalysisJobFailed(
      jobId,
      `Repository not found: ${repositoryId}`,
    );
    return { status: "failed", jobId };
  }

  try {
    await markAnalysisJobProcessing(jobId, inngestRunId);

    const { report, defaultBranch } = await executeGithubAnalysis(
      repository.githubUrl,
    );

    await saveAnalysisReport(jobId, repositoryId, report);
    await updateRepositoryDefaultBranch(repositoryId, defaultBranch);
    await updateRepositoryLastAnalyzedAt(repositoryId, new Date());
    await markAnalysisJobCompleted(jobId);

    return { status: "completed", jobId };
  } catch (error) {
    await markAnalysisJobFailed(jobId, classifyAnalysisError(error));
    return { status: "failed", jobId };
  }
}
