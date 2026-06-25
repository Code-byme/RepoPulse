import type { GithubClient } from "@/lib/github/client";
import {
  FILE_FETCH_CONCURRENCY,
  MAX_TODO_SCAN_FILES,
} from "@/lib/github/constants";
import { fetchFileContents } from "@/lib/github/contents";
import {
  toRepositoryMetadata,
  toTreeEntryList,
} from "@/lib/github/mappers";
import {
  parseRepositoryCoordinates,
  fetchRepositoryMetadataByUrl,
} from "@/lib/github/repository";
import { fetchRepositoryTreeByUrl } from "@/lib/github/tree";
import { selectFilesForTodoScanning } from "@/lib/github/todo-selection";
import type {
  AnalysisReportInput,
  FileContent,
  RepositoryMetadata,
  TreeEntry,
} from "@/types/github-analysis";

export type RepositoryAnalysisData = {
  metadata: RepositoryMetadata;
  tree: TreeEntry[];
  fileContents: FileContent[];
  treeTruncated: boolean;
  branch: string;
  failedFileFetches: number;
};

export type LoadRepositoryAnalysisDataOptions = {
  maxTodoFiles?: number;
};

export async function loadRepositoryAnalysisData(
  client: GithubClient,
  githubUrl: string,
  options: LoadRepositoryAnalysisDataOptions = {},
): Promise<RepositoryAnalysisData> {
  const maxTodoFiles = options.maxTodoFiles ?? MAX_TODO_SCAN_FILES;
  const { owner, repo } = parseRepositoryCoordinates(githubUrl);

  const [rawMetadata, treeResult] = await Promise.all([
    fetchRepositoryMetadataByUrl(client, githubUrl),
    fetchRepositoryTreeByUrl(client, githubUrl),
  ]);

  const metadata = toRepositoryMetadata(rawMetadata);
  const tree = toTreeEntryList(treeResult.tree);
  const blobPaths = tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => entry.path);
  const todoPaths = selectFilesForTodoScanning(blobPaths, maxTodoFiles);
  const fileContents = await fetchFileContents(
    client,
    owner,
    repo,
    todoPaths,
    treeResult.branch,
    FILE_FETCH_CONCURRENCY,
  );

  return {
    metadata,
    tree,
    fileContents,
    treeTruncated: treeResult.tree.truncated,
    branch: treeResult.branch,
    failedFileFetches: todoPaths.length - fileContents.length,
  };
}

export function toAnalysisReportInput(
  data: RepositoryAnalysisData,
): AnalysisReportInput {
  return {
    metadata: data.metadata,
    tree: data.tree,
    fileContents: data.fileContents,
    treeTruncated: data.treeTruncated,
    failedFileFetches: data.failedFileFetches,
  };
}
