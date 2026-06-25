import type { FileContent, TodoItem, TreeEntry } from "@/types/github-analysis";
import {
  isTodoScannablePath,
  selectFilesForTodoScanning,
} from "@/lib/github/todo-selection";

export { isTodoScannablePath, selectFilesForTodoScanning };

const TODO_PATTERN = /\b(TODO|FIXME)\b(?:[:\s-]+(.*))?$/i;

export function selectTodoScanTargets(
  tree: TreeEntry[],
  maxFiles = 200,
): string[] {
  return selectFilesForTodoScanning(
    tree.filter((entry) => entry.type === "blob").map((entry) => entry.path),
    maxFiles,
  );
}

export function extractTodosFromContent(
  path: string,
  content: string,
): TodoItem[] {
  const lines = content.split(/\r?\n/);
  const items: TodoItem[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const match = line.match(TODO_PATTERN);

    if (!match?.[1]) {
      continue;
    }

    const kind = match[1].toUpperCase() as "TODO" | "FIXME";
    const trailingText = match[2]?.trim();
    const matchedText = trailingText
      ? `${kind}: ${trailingText}`
      : kind;

    items.push({
      path,
      line: index + 1,
      matchedText,
      kind,
    });
  }

  return items;
}

export function extractTodosFromFiles(files: FileContent[]): TodoItem[] {
  return files.flatMap((file) =>
    extractTodosFromContent(file.path, file.content),
  );
}

export function summarizeTodos(items: TodoItem[], scannedFileCount: number) {
  const todoCount = items.filter((item) => item.kind === "TODO").length;
  const fixmeCount = items.filter((item) => item.kind === "FIXME").length;

  return {
    total: items.length,
    todoCount,
    fixmeCount,
    items,
    scannedFileCount,
  };
}
