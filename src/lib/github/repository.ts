import type { GithubClient } from "@/lib/github/client";
import type { GithubRepositoryResponse } from "@/lib/github/types";
import { extractOwnerAndName } from "@/lib/utils/github-url";

export type RepositoryCoordinates = {
  owner: string;
  repo: string;
};

export function parseRepositoryCoordinates(
  githubUrl: string,
): RepositoryCoordinates {
  const { owner, name } = extractOwnerAndName(githubUrl);
  return { owner, repo: name };
}

export async function fetchRepositoryMetadata(
  client: GithubClient,
  owner: string,
  repo: string,
): Promise<GithubRepositoryResponse> {
  return client.request<GithubRepositoryResponse>({
    path: `/repos/${owner}/${repo}`,
  });
}

export async function fetchRepositoryMetadataByUrl(
  client: GithubClient,
  githubUrl: string,
): Promise<GithubRepositoryResponse> {
  const { owner, repo } = parseRepositoryCoordinates(githubUrl);
  return fetchRepositoryMetadata(client, owner, repo);
}
