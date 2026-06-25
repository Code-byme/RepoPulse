export const MAX_TODO_SCAN_FILES = 200;
export const FILE_FETCH_CONCURRENCY = 5;
export const MAX_FILE_SIZE_BYTES = 1024 * 1024;

export const TODO_SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".rb",
  ".php",
  ".swift",
  ".kt",
  ".cs",
  ".vue",
  ".svelte",
  ".md",
  ".css",
  ".scss",
  ".html",
  ".sql",
  ".sh",
]);

export const TODO_PRIORITY_PREFIXES = [
  "src/",
  "app/",
  "pages/",
  "components/",
  "lib/",
  "server/",
];
