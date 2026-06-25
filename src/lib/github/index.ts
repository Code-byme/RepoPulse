export { createGithubClient, GithubApiError, type GithubClient } from "@/lib/github/client";
export { decodeGithubFileContent } from "@/lib/github/decode";
export {
  loadRepositoryAnalysisData,
  toAnalysisReportInput,
  type LoadRepositoryAnalysisDataOptions,
  type RepositoryAnalysisData,
} from "@/lib/github/data-loader";
export {
  fetchFileContent,
  fetchFileContents,
} from "@/lib/github/contents";
export {
  fetchRepositoryMetadata,
  fetchRepositoryMetadataByUrl,
  parseRepositoryCoordinates,
  type RepositoryCoordinates,
} from "@/lib/github/repository";
export {
  fetchRepositoryTree,
  fetchRepositoryTreeByUrl,
  type RepositoryTreeResult,
} from "@/lib/github/tree";
export {
  isTodoScannablePath,
  selectFilesForTodoScanning,
} from "@/lib/github/todo-selection";
export type {
  GithubCommitResponse,
  GithubContentResponse,
  GithubContributorResponse,
  GithubLanguageResponse,
  GithubRepositoryResponse,
  GithubTreeItem,
  GithubTreeResponse,
} from "@/lib/github/types";
