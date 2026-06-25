import { parseGithubRepoUrl } from "@/lib/utils/github-url";
import {
  createRepository,
  findRepositoryByFullName,
  findRepositoryByGithubUrl,
  findRepositoryById,
} from "@/server/repositories/repository.repository";
import { toRepository } from "@/server/mappers/repository.mapper";
import { InvalidRepositoryUrlError, ServiceError } from "@/server/errors";
import type { NewRepository, Repository } from "@/types/repository";

export function validateAndNormalizeRepoUrl(repoUrl: string): string {
  const parsed = parseGithubRepoUrl(repoUrl);

  if (!parsed) {
    throw new InvalidRepositoryUrlError();
  }

  return parsed.normalizedUrl;
}

function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    ("code" in error && (error as { code?: string }).code === "23505") ||
    error.message.toLowerCase().includes("unique")
  );
}

export async function findOrCreateRepository(repoUrl: string): Promise<Repository> {
  const normalizedUrl = validateAndNormalizeRepoUrl(repoUrl);
  const parsed = parseGithubRepoUrl(normalizedUrl);

  if (!parsed) {
    throw new InvalidRepositoryUrlError();
  }

  const existing =
    (await findRepositoryByFullName(parsed.fullName)) ??
    (await findRepositoryByGithubUrl(normalizedUrl));

  if (existing) {
    return toRepository(existing);
  }

  const input: NewRepository = {
    owner: parsed.owner,
    name: parsed.name,
    fullName: parsed.fullName,
    githubUrl: normalizedUrl,
  };

  try {
    const created = await createRepository(input);
    return toRepository(created);
  } catch (error) {
    if (isUniqueViolation(error)) {
      const raced = await findRepositoryByFullName(parsed.fullName);

      if (raced) {
        return toRepository(raced);
      }
    }

    throw new ServiceError("Failed to create repository record", 500);
  }
}

export async function getRepositoryById(id: string): Promise<Repository | null> {
  const row = await findRepositoryById(id);
  return row ? toRepository(row) : null;
}
