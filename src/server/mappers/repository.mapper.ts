import type { RepositoryRow } from "@/lib/db/schema";
import type { Repository } from "@/types/repository";

export function toRepository(row: RepositoryRow): Repository {
  return {
    id: row.id,
    owner: row.owner,
    name: row.name,
    fullName: row.fullName,
    githubUrl: row.githubUrl,
    defaultBranch: row.defaultBranch,
    lastAnalyzedAt: row.lastAnalyzedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
