import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  analysisResults,
  type AnalysisResultRow,
  type NewAnalysisResultRow,
} from "@/lib/db/schema";
import { findLatestCompletedAnalysisJobByRepositoryId } from "@/server/repositories/analysis-job.repository";

export async function findAnalysisResultByJobId(
  jobId: string,
): Promise<AnalysisResultRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisResults)
    .where(eq(analysisResults.jobId, jobId))
    .limit(1);

  return row;
}

export async function findLatestAnalysisResultByRepositoryId(
  repositoryId: string,
): Promise<AnalysisResultRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisResults)
    .where(eq(analysisResults.repositoryId, repositoryId))
    .orderBy(desc(analysisResults.createdAt))
    .limit(1);

  return row;
}

export async function findLatestCompletedAnalysisResultByRepositoryId(
  repositoryId: string,
): Promise<AnalysisResultRow | undefined> {
  const completedJob =
    await findLatestCompletedAnalysisJobByRepositoryId(repositoryId);

  if (!completedJob) {
    return undefined;
  }

  return findAnalysisResultByJobId(completedJob.id);
}

export async function createAnalysisResult(
  data: NewAnalysisResultRow,
): Promise<AnalysisResultRow> {
  const [row] = await db.insert(analysisResults).values(data).returning();

  if (!row) {
    throw new Error("Failed to create analysis result");
  }

  return row;
}

export async function createAnalysisResultIfNotExists(
  data: NewAnalysisResultRow,
): Promise<AnalysisResultRow> {
  const existing = await findAnalysisResultByJobId(data.jobId);

  if (existing) {
    return existing;
  }

  return createAnalysisResult(data);
}
