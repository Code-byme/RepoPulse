import {
  CONFIG_FILES,
  GITHUB_WORKFLOWS_PATH,
} from "@/server/analysis/constants";
import { inferArchitectureStyle } from "@/server/analysis/architecture";
import type {
  DetectedConfigs,
  DetectedFolders,
  StructureDetection,
  TreeEntry,
} from "@/types/github-analysis";

function normalizePath(path: string): string {
  return path.replace(/^\.\//, "");
}

function hasFolder(tree: TreeEntry[], folderName: string): boolean {
  const prefix = `${folderName}/`;

  return tree.some((entry) => {
    const path = normalizePath(entry.path);
    return path === folderName || path.startsWith(prefix);
  });
}

/** Matches a top-level folder or the same folder nested under common src-based layouts. */
function hasFolderAtRootOrUnderSrc(
  tree: TreeEntry[],
  folderName: string,
): boolean {
  if (hasFolder(tree, folderName)) {
    return true;
  }

  return hasFolder(tree, `src/${folderName}`);
}

const NEXTJS_API_PREFIXES = [
  "api/",
  "app/api/",
  "src/app/api/",
  "pages/api/",
  "src/pages/api/",
] as const;

function hasPathPrefix(tree: TreeEntry[], prefixes: readonly string[]): boolean {
  return tree.some((entry) => {
    const path = normalizePath(entry.path);
    return prefixes.some(
      (prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix),
    );
  });
}

function hasApiRoutes(tree: TreeEntry[]): boolean {
  return hasPathPrefix(tree, NEXTJS_API_PREFIXES);
}

function hasGithubWorkflows(tree: TreeEntry[]): boolean {
  const prefix = `${GITHUB_WORKFLOWS_PATH}/`;

  return tree.some((entry) => {
    const path = normalizePath(entry.path);
    return path.startsWith(prefix) && entry.type === "blob";
  });
}

function hasConfigFile(tree: TreeEntry[], candidates: readonly string[]): boolean {
  const candidateSet = new Set(candidates);

  return tree.some((entry) => {
    if (entry.type !== "blob") {
      return false;
    }

    const fileName = normalizePath(entry.path).split("/").pop() ?? "";
    return candidateSet.has(fileName);
  });
}

export function detectFolders(tree: TreeEntry[]): DetectedFolders {
  return {
    src: hasFolder(tree, "src"),
    app: hasFolderAtRootOrUnderSrc(tree, "app"),
    pages: hasFolderAtRootOrUnderSrc(tree, "pages"),
    api: hasApiRoutes(tree),
    components: hasFolderAtRootOrUnderSrc(tree, "components"),
    services: hasFolderAtRootOrUnderSrc(tree, "services"),
    lib: hasFolderAtRootOrUnderSrc(tree, "lib"),
    db: hasFolderAtRootOrUnderSrc(tree, "db"),
    tests:
      hasFolderAtRootOrUnderSrc(tree, "tests") || hasFolder(tree, "__tests__"),
    githubWorkflows: hasGithubWorkflows(tree),
  };
}

export function detectConfigs(tree: TreeEntry[]): DetectedConfigs {
  return {
    dockerfile: hasConfigFile(tree, CONFIG_FILES.dockerfile),
    dockerCompose: hasConfigFile(tree, CONFIG_FILES.dockerCompose),
    packageJson: hasConfigFile(tree, CONFIG_FILES.packageJson),
    tsconfig: hasConfigFile(tree, CONFIG_FILES.tsconfig),
    eslint: hasConfigFile(tree, CONFIG_FILES.eslint),
    prettier: hasConfigFile(tree, CONFIG_FILES.prettier),
  };
}

export function detectStructure(tree: TreeEntry[]): StructureDetection {
  const folders = detectFolders(tree);
  const configs = detectConfigs(tree);

  return {
    folders,
    configs,
    architectureStyle: inferArchitectureStyle(folders, configs),
  };
}
