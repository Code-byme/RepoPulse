import type { LanguageBreakdown } from "@/types/github-analysis";
import { SectionCard } from "@/components/ui/SectionCard";

type ReportLanguagesSectionProps = {
  languages: LanguageBreakdown;
};

export function ReportLanguagesSection({ languages }: ReportLanguagesSectionProps) {
  const sortedExtensions = Object.entries(languages.byExtension).sort(
    (left, right) => right[1] - left[1],
  );

  return (
    <SectionCard
      title="Language breakdown"
      description="File counts grouped by language and extension."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="rp-subheading">By language</h3>
          {languages.byLanguage.length > 0 ? (
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Files</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {languages.byLanguage.map((entry) => (
                    <tr key={entry.language}>
                      <td className="font-mono text-blue">{entry.language}</td>
                      <td className="font-mono">{entry.fileCount}</td>
                      <td className="font-mono">{entry.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-text-muted">No language data</p>
          )}
        </div>

        <div>
          <h3 className="rp-subheading">By extension</h3>
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
            <p className="text-sm text-text-muted">No extension data</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
