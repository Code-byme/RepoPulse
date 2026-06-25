import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  analysisJobs,
  type AnalysisJobRow,
  type NewAnalysisJobRow,
} from "@/lib/db/schema";
import type { AnalysisJobStatus } from "@/types/analysis";

export async function findAnalysisJobById(
  id: string,
): Promise<AnalysisJobRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisJobs)
    .where(eq(analysisJobs.id, id))
    .limit(1);

  return row;
}

export async function findLatestAnalysisJobByRepositoryId(
  repositoryId: string,
): Promise<AnalysisJobRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisJobs)
    .where(eq(analysisJobs.repositoryId, repositoryId))
    .orderBy(desc(analysisJobs.createdAt))
    .limit(1);

  return row;
}

export async function createAnalysisJob(
  data: NewAnalysisJobRow,
): Promise<AnalysisJobRow> {
  const [row] = await db.insert(analysisJobs).values(data).returning();

  if (!row) {
    throw new Error("Failed to create analysis job");
  }

  return row;
}

export async function findAnalysisJobsByRepositoryId(
  repositoryId: string,
): Promise<AnalysisJobRow[]> {
  return db
    .select()
    .from(analysisJobs)
    .where(eq(analysisJobs.repositoryId, repositoryId))
    .orderBy(desc(analysisJobs.createdAt));
}

export async function findLatestCompletedAnalysisJobByRepositoryId(
  repositoryId: string,
): Promise<AnalysisJobRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisJobs)
    .where(
      and(
        eq(analysisJobs.repositoryId, repositoryId),
        eq(analysisJobs.status, "completed"),
      ),
    )
    .orderBy(desc(analysisJobs.completedAt))
    .limit(1);

  return row;
}

export async function findActiveAnalysisJobByRepositoryId(
  repositoryId: string,
): Promise<AnalysisJobRow | undefined> {
  const [row] = await db
    .select()
    .from(analysisJobs)
    .where(
      and(
        eq(analysisJobs.repositoryId, repositoryId),
        inArray(analysisJobs.status, ["queued", "processing"]),
      ),
    )
    .orderBy(desc(analysisJobs.createdAt))
    .limit(1);

  return row;
}

export async function updateAnalysisJobStatus(
  id: string,
  status: AnalysisJobStatus,
  fields: Partial<
    Pick<
      AnalysisJobRow,
      "inngestRunId" | "errorMessage" | "startedAt" | "completedAt"
    >
  > = {},
): Promise<AnalysisJobRow | undefined> {
  const [row] = await db
    .update(analysisJobs)
    .set({
      status,
      ...fields,
      updatedAt: new Date(),
    })
    .where(eq(analysisJobs.id, id))
    .returning();

  return row;
}
