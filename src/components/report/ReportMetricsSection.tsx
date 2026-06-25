import type { MetricsJson } from "@/types/github-analysis";
import { formatNumber } from "@/lib/utils/format";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

type ReportMetricsSectionProps = {
  metrics: MetricsJson;
};

export function ReportMetricsSection({ metrics }: ReportMetricsSectionProps) {
  const sortedExtensions = Object.entries(metrics.extensionCounts).sort(
    (left, right) => right[1] - left[1],
  );

  return (
    <SectionCard
      title="Metrics"
      description="Repository structure and file distribution."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total files" value={formatNumber(metrics.totalFiles)} />
        <StatCard
          label="Total directories"
          value={formatNumber(metrics.totalDirectories)}
        />
        <StatCard
          label="Repository size (KB)"
          value={formatNumber(metrics.repositorySizeKb)}
        />
        <StatCard
          label="Open issues"
          value={formatNumber(metrics.openIssues)}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Top-level folders
          </h3>
          {metrics.topLevelFolders.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {metrics.topLevelFolders.map((folder) => (
                <li
                  key={folder}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {folder}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">None detected</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Largest top-level folders
          </h3>
          {metrics.largestTopLevelFolders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2 pr-4 font-medium text-zinc-500">Folder</th>
                    <th className="py-2 font-medium text-zinc-500">Files</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.largestTopLevelFolders.map((folder) => (
                    <tr
                      key={folder.name}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">{folder.name}</td>
                      <td className="py-2">{folder.fileCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">None detected</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Extension counts
        </h3>
        {sortedExtensions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 pr-4 font-medium text-zinc-500">Extension</th>
                  <th className="py-2 font-medium text-zinc-500">Files</th>
                </tr>
              </thead>
              <tbody>
                {sortedExtensions.map(([extension, count]) => (
                  <tr
                    key={extension}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{extension}</td>
                    <td className="py-2">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No extensions found</p>
        )}
      </div>

      {metrics.treeTruncated ? (
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">
          File tree was truncated by GitHub API limits. Metrics may be partial.
        </p>
      ) : null}
    </SectionCard>
  );
}
