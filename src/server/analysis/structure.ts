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
    app: hasFolder(tree, "app"),
    pages: hasFolder(tree, "pages"),
    api: hasFolder(tree, "api"),
    components: hasFolder(tree, "components"),
    services: hasFolder(tree, "services"),
    lib: hasFolder(tree, "lib"),
    db: hasFolder(tree, "db"),
    tests: hasFolder(tree, "tests") || hasFolder(tree, "__tests__"),
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
