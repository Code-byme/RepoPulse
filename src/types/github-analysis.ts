export type ArchitectureStyle =
  | "modular-monolith"
  | "frontend-heavy"
  | "backend-heavy"
  | "fullstack-app"
  | "unknown";

export type RepositoryMetadata = {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string | null;
  topics: string[];
  isArchived: boolean;
  pushedAt: string | null;
  createdAt: string;
  sizeKb: number;
};

export type TreeEntry = {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size: number | null;
};

export type FileContent = {
  path: string;
  content: string;
  size: number;
};

export type StructureMetrics = {
  totalFiles: number;
  totalDirectories: number;
  topLevelFolders: string[];
  extensionCounts: Record<string, number>;
  largestTopLevelFolders: Array<{ name: string; fileCount: number }>;
  treeTruncated: boolean;
};

export type DetectedFolders = {
  src: boolean;
  app: boolean;
  pages: boolean;
  api: boolean;
  components: boolean;
  services: boolean;
  lib: boolean;
  db: boolean;
  tests: boolean;
  githubWorkflows: boolean;
};

export type DetectedConfigs = {
  dockerfile: boolean;
  dockerCompose: boolean;
  packageJson: boolean;
  tsconfig: boolean;
  eslint: boolean;
  prettier: boolean;
};

export type StructureDetection = {
  folders: DetectedFolders;
  configs: DetectedConfigs;
  architectureStyle: ArchitectureStyle;
};

export type LanguageBreakdown = {
  byExtension: Record<string, number>;
  byLanguage: Array<{ language: string; fileCount: number; percentage: number }>;
  primaryLanguage: string | null;
};

export type TodoItem = {
  path: string;
  line: number;
  matchedText: string;
  kind: "TODO" | "FIXME";
};

export type SummaryJson = {
  headline: string;
  description: string;
  repository: {
    fullName: string;
    url: string;
    defaultBranch: string;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
  };
  architectureStyle: ArchitectureStyle;
  highlights: string[];
};

export type MetricsJson = StructureMetrics & {
  repositorySizeKb: number;
  openIssues: number;
};

export type LanguagesJson = LanguageBreakdown;

export type StructureJson = StructureDetection;

export type TodosJson = {
  total: number;
  todoCount: number;
  fixmeCount: number;
  items: TodoItem[];
  scannedFileCount: number;
};

export type AnalysisReport = {
  summary_json: SummaryJson;
  metrics_json: MetricsJson;
  languages_json: LanguagesJson;
  structure_json: StructureJson;
  todos_json: TodosJson;
};

export type AnalysisReportInput = {
  metadata: RepositoryMetadata;
  tree: TreeEntry[];
  fileContents: FileContent[];
  treeTruncated?: boolean;
  failedFileFetches?: number;
};
