import { DEFAULT_TOP_LEVEL_FOLDER_LIMIT } from "@/server/analysis/constants";
import type { StructureMetrics, TreeEntry } from "@/types/github-analysis";

function getExtension(path: string): string {
  const fileName = path.split("/").pop() ?? path;
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return "(none)";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

function getTopLevelFolder(path: string): string | null {
  const segments = path.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  return segments[0] ?? null;
}

export function computeStructureMetrics(
  tree: TreeEntry[],
  treeTruncated = false,
): StructureMetrics {
  const files = tree.filter((entry) => entry.type === "blob");
  const directories = tree.filter((entry) => entry.type === "tree");

  const extensionCounts: Record<string, number> = {};
  const topLevelFolderCounts = new Map<string, number>();
  const topLevelFolders = new Set<string>();

  for (const file of files) {
    const extension = getExtension(file.path);
    extensionCounts[extension] = (extensionCounts[extension] ?? 0) + 1;

    const topLevelFolder = getTopLevelFolder(file.path);

    if (topLevelFolder) {
      topLevelFolders.add(topLevelFolder);
      topLevelFolderCounts.set(
        topLevelFolder,
        (topLevelFolderCounts.get(topLevelFolder) ?? 0) + 1,
      );
    }
  }

  const largestTopLevelFolders = [...topLevelFolderCounts.entries()]
    .map(([name, fileCount]) => ({ name, fileCount }))
    .sort((left, right) => right.fileCount - left.fileCount)
    .slice(0, DEFAULT_TOP_LEVEL_FOLDER_LIMIT);

  return {
    totalFiles: files.length,
    totalDirectories: directories.length,
    topLevelFolders: [...topLevelFolders].sort(),
    extensionCounts,
    largestTopLevelFolders,
    treeTruncated,
  };
}
