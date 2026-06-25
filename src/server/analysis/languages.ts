import {
  EXTENSION_TO_LANGUAGE,
} from "@/server/analysis/constants";
import type { LanguageBreakdown, StructureMetrics } from "@/types/github-analysis";

function toPercentage(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 1000) / 10;
}

export function aggregateLanguages(
  metrics: StructureMetrics,
  primaryLanguage: string | null,
): LanguageBreakdown {
  const byExtension = { ...metrics.extensionCounts };
  const totalFiles = metrics.totalFiles;
  const languageCounts = new Map<string, number>();

  for (const [extension, count] of Object.entries(byExtension)) {
    const language = EXTENSION_TO_LANGUAGE[extension] ?? "Other";
    languageCounts.set(language, (languageCounts.get(language) ?? 0) + count);
  }

  const byLanguage = [...languageCounts.entries()]
    .map(([language, fileCount]) => ({
      language,
      fileCount,
      percentage: toPercentage(fileCount, totalFiles),
    }))
    .sort((left, right) => right.fileCount - left.fileCount);

  return {
    byExtension,
    byLanguage,
    primaryLanguage,
  };
}
