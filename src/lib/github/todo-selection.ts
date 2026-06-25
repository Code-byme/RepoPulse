import {
  MAX_TODO_SCAN_FILES,
  TODO_PRIORITY_PREFIXES,
  TODO_SCAN_EXTENSIONS,
} from "@/lib/github/constants";

export { TODO_SCAN_EXTENSIONS };

export function isTodoScannablePath(path: string): boolean {
  const fileName = path.split("/").pop() ?? path;
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return false;
  }

  return TODO_SCAN_EXTENSIONS.has(fileName.slice(dotIndex).toLowerCase());
}

function todoPriorityScore(path: string): number {
  for (let index = 0; index < TODO_PRIORITY_PREFIXES.length; index += 1) {
    if (path.startsWith(TODO_PRIORITY_PREFIXES[index]!)) {
      return TODO_PRIORITY_PREFIXES.length - index;
    }
  }

  return 0;
}

export function selectFilesForTodoScanning(
  paths: string[],
  maxFiles = MAX_TODO_SCAN_FILES,
): string[] {
  return paths
    .filter((path) => isTodoScannablePath(path))
    .sort((left, right) => {
      const priorityDiff = todoPriorityScore(right) - todoPriorityScore(left);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return left.localeCompare(right);
    })
    .slice(0, maxFiles);
}
