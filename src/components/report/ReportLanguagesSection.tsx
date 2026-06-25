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
          <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            By language
          </h3>
          {languages.byLanguage.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2 pr-4 font-medium text-zinc-500">Language</th>
                    <th className="py-2 pr-4 font-medium text-zinc-500">Files</th>
                    <th className="py-2 font-medium text-zinc-500">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {languages.byLanguage.map((entry) => (
                    <tr
                      key={entry.language}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="py-2 pr-4">{entry.language}</td>
                      <td className="py-2 pr-4">{entry.fileCount}</td>
                      <td className="py-2">{entry.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No language data</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            By extension
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
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No extension data</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
