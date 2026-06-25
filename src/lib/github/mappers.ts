import type {
  GithubRepositoryResponse,
  GithubTreeResponse,
} from "@/lib/github/types";
import type { RepositoryMetadata, TreeEntry } from "@/types/github-analysis";

export function toRepositoryMetadata(
  response: GithubRepositoryResponse,
): RepositoryMetadata {
  return {
    owner: response.owner.login,
    name: response.name,
    fullName: response.full_name,
    url: response.html_url,
    defaultBranch: response.default_branch,
    description: response.description,
    stars: response.stargazers_count,
    forks: response.forks_count,
    openIssues: response.open_issues_count,
    primaryLanguage: response.language,
    topics: response.topics ?? [],
    isArchived: response.archived,
    pushedAt: response.pushed_at,
    createdAt: response.created_at,
    sizeKb: response.size,
  };
}

export function toTreeEntryList(tree: GithubTreeResponse): TreeEntry[] {
  return tree.tree
    .filter(
      (item): item is typeof item & { path: string } =>
        typeof item.path === "string" && item.path.length > 0,
    )
    .map((item) => ({
      path: item.path,
      type: item.type,
      sha: item.sha,
      size: item.size ?? null,
    }));
}
