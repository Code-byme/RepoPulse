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
          <h3 className="rp-subheading">Top-level folders</h3>
          {metrics.topLevelFolders.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {metrics.topLevelFolders.map((folder) => (
                <li key={folder} className="rp-chip">
                  {folder}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">None detected</p>
          )}
        </div>

        <div>
          <h3 className="rp-subheading">Largest top-level folders</h3>
          {metrics.largestTopLevelFolders.length > 0 ? (
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Folder</th>
                    <th>Files</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.largestTopLevelFolders.map((folder) => (
                    <tr key={folder.name}>
                      <td className="rp-mono">{folder.name}</td>
                      <td className="font-mono">{folder.fileCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-text-muted">None detected</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="rp-subheading">Extension counts</h3>
        {sortedExtensions.length > 0 ? (
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Extension</th>
                  <th>Files</th>
                </tr>
              </thead>
              <tbody>
                {sortedExtensions.map(([extension, count]) => (
                  <tr key={extension}>
                    <td className="rp-mono">{extension}</td>
                    <td className="font-mono">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-muted">No extensions found</p>
        )}
      </div>

      {metrics.treeTruncated ? (
        <p className="mt-4 text-sm text-accent">
          File tree was truncated by GitHub API limits. Metrics may be partial.
        </p>
      ) : null}
    </SectionCard>
  );
}
