export type GithubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  default_branch: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  topics?: string[];
  size: number;
  pushed_at: string | null;
  created_at: string;
  archived: boolean;
};

export type GithubLanguageResponse = Record<string, number>;

export type GithubContributorResponse = {
  login: string;
  contributions: number;
}[];

export type GithubCommitResponse = {
  sha: string;
  commit: {
    tree: {
      sha: string;
    };
  };
};

export type GithubTreeItem = {
  path?: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
};

export type GithubTreeResponse = {
  sha: string;
  url: string;
  tree: GithubTreeItem[];
  truncated: boolean;
};

export type GithubContentResponse = {
  type: "file" | "dir" | "symlink" | "submodule";
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
};
