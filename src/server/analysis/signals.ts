import type { DetectedFolders } from "@/types/github-analysis";

/** Folder flags produced by structure detection — used across report UI and architecture inference. */
export function hasFrontendSignals(folders: DetectedFolders): boolean {
  return folders.app || folders.pages || folders.components;
}

export function hasBackendSignals(folders: DetectedFolders): boolean {
  return folders.api || folders.services || folders.db;
}
