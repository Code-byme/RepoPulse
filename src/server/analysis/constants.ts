export const STRUCTURE_FOLDERS = [
  "src",
  "app",
  "pages",
  "api",
  "components",
  "services",
  "lib",
  "db",
  "tests",
] as const;

export const GITHUB_WORKFLOWS_PATH = ".github/workflows";

export const CONFIG_FILES = {
  dockerfile: ["Dockerfile"],
  dockerCompose: ["docker-compose.yml", "docker-compose.yaml"],
  packageJson: ["package.json"],
  tsconfig: ["tsconfig.json"],
  eslint: [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
  ],
  prettier: [
    ".prettierrc",
    ".prettierrc.js",
    ".prettierrc.json",
    "prettier.config.js",
    "prettier.config.mjs",
  ],
} as const;

export const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".py": "Python",
  ".go": "Go",
  ".md": "Markdown",
  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".html": "HTML",
  ".rs": "Rust",
  ".java": "Java",
  ".rb": "Ruby",
  ".php": "PHP",
  ".sql": "SQL",
  ".sh": "Shell",
};

export const DEFAULT_TOP_LEVEL_FOLDER_LIMIT = 10;
