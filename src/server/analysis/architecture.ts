import {
  hasBackendSignals,
  hasFrontendSignals,
} from "@/server/analysis/signals";
import type {
  ArchitectureStyle,
  DetectedConfigs,
  DetectedFolders,
} from "@/types/github-analysis";

export function inferArchitectureStyle(
  folders: DetectedFolders,
  configs: DetectedConfigs,
): ArchitectureStyle {
  const frontend = hasFrontendSignals(folders);
  const backend = hasBackendSignals(folders);
  const hasSharedModuleRoot = folders.src || folders.lib;

  if (frontend && backend) {
    return "fullstack-app";
  }

  if (frontend && !backend) {
    return "frontend-heavy";
  }

  if (backend && !frontend) {
    return "backend-heavy";
  }

  if (
    hasSharedModuleRoot &&
    [folders.services, folders.components, folders.db, folders.api].filter(Boolean)
      .length >= 2
  ) {
    return "modular-monolith";
  }

  if (configs.packageJson && (folders.src || folders.app)) {
    return "fullstack-app";
  }

  return "unknown";
}
