import type {
  ArchitectureStyle,
  DetectedConfigs,
  DetectedFolders,
} from "@/types/github-analysis";

export function inferArchitectureStyle(
  folders: DetectedFolders,
  configs: DetectedConfigs,
): ArchitectureStyle {
  const hasFrontendSignals =
    folders.app || folders.pages || folders.components;
  const hasBackendSignals =
    folders.api || folders.services || folders.db;
  const hasSharedModuleRoot = folders.src || folders.lib;

  if (hasFrontendSignals && hasBackendSignals) {
    return "fullstack-app";
  }

  if (hasFrontendSignals && !hasBackendSignals) {
    return "frontend-heavy";
  }

  if (hasBackendSignals && !hasFrontendSignals) {
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
