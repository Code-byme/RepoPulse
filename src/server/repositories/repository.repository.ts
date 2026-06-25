import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  repositories,
  type NewRepositoryRow,
  type RepositoryRow,
} from "@/lib/db/schema";

export async function findRepositoryById(
  id: string,
): Promise<RepositoryRow | undefined> {
  const [row] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.id, id))
    .limit(1);

  return row;
}

export async function findRepositoryByFullName(
  fullName: string,
): Promise<RepositoryRow | undefined> {
  const [row] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.fullName, fullName))
    .limit(1);

  return row;
}

export async function findRepositoryByGithubUrl(
  githubUrl: string,
): Promise<RepositoryRow | undefined> {
  const [row] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.githubUrl, githubUrl))
    .limit(1);

  return row;
}

export async function createRepository(
  data: NewRepositoryRow,
): Promise<RepositoryRow> {
  const [row] = await db.insert(repositories).values(data).returning();

  if (!row) {
    throw new Error("Failed to create repository");
  }

  return row;
}

export async function updateRepositoryLastAnalyzedAt(
  id: string,
  lastAnalyzedAt: Date,
): Promise<RepositoryRow | undefined> {
  const [row] = await db
    .update(repositories)
    .set({
      lastAnalyzedAt,
      updatedAt: new Date(),
    })
    .where(eq(repositories.id, id))
    .returning();

  return row;
}

export async function updateRepositoryDefaultBranch(
  id: string,
  defaultBranch: string,
): Promise<RepositoryRow | undefined> {
  const [row] = await db
    .update(repositories)
    .set({
      defaultBranch,
      updatedAt: new Date(),
    })
    .where(eq(repositories.id, id))
    .returning();

  return row;
}
