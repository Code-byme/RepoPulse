import "server-only";

import { NotFoundError } from "@/server/errors";
import {
  getRepositoryReportByRepositoryId,
  getRepositoryWithLatestJob,
  listRepositoriesWithLatestJob,
} from "@/server/services/repository-read.service";
import { parseUuidParam } from "@/lib/validators/params";

export async function loadRepositoryList() {
  return listRepositoriesWithLatestJob();
}

export async function loadRepositoryDetail(repositoryId: string) {
  parseUuidParam(repositoryId);

  try {
    return await getRepositoryWithLatestJob(repositoryId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

export async function loadRepositoryReport(repositoryId: string) {
  parseUuidParam(repositoryId);

  try {
    return await getRepositoryReportByRepositoryId(repositoryId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

export async function loadAnalysisJob(jobId: string) {
  parseUuidParam(jobId);

  const { getAnalysisJobById } = await import(
    "@/server/services/analysis.service"
  );

  return getAnalysisJobById(jobId);
}
