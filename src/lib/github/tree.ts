import type { GithubClient } from "@/lib/github/client";
import type { GithubCommitResponse, GithubTreeResponse } from "@/lib/github/types";
import {
  fetchRepositoryMetadata,
  parseRepositoryCoordinates,
} from "@/lib/github/repository";

export type RepositoryTreeResult = {
  branch: string;
  tree: GithubTreeResponse;
};

async function fetchCommitTreeSha(
  client: GithubClient,
  owner: string,
  repo: string,
  branch: string,
): Promise<string> {
  const commit = await client.request<GithubCommitResponse>({
    path: `/repos/${owner}/${repo}/commits/${encodeURIComponent(branch)}`,
  });

  return commit.commit.tree.sha;
}

export async function fetchRepositoryTree(
  client: GithubClient,
  owner: string,
  repo: string,
  branch?: string,
): Promise<RepositoryTreeResult> {
  const metadata = branch
    ? { default_branch: branch }
    : await fetchRepositoryMetadata(client, owner, repo);

  const resolvedBranch = branch ?? metadata.default_branch;
  const treeSha = await fetchCommitTreeSha(
    client,
    owner,
    repo,
    resolvedBranch,
  );

  const tree = await client.request<GithubTreeResponse>({
    path: `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
  });

  return { branch: resolvedBranch, tree };
}

export async function fetchRepositoryTreeByUrl(
  client: GithubClient,
  githubUrl: string,
  branch?: string,
): Promise<RepositoryTreeResult> {
  const { owner, repo } = parseRepositoryCoordinates(githubUrl);
  return fetchRepositoryTree(client, owner, repo, branch);
}
