import type { TodosJson } from "@/types/github-analysis";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

type ReportTodosSectionProps = {
  todos: TodosJson;
};

export function ReportTodosSection({ todos }: ReportTodosSectionProps) {
  return (
    <SectionCard
      title="TODO / FIXME findings"
      description={`Scanned ${todos.scannedFileCount} files — ${todos.todoCount} TODO, ${todos.fixmeCount} FIXME.`}
    >
      {todos.items.length > 0 ? (
        <div className="rp-table-wrap">
          <table className="rp-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Line</th>
                <th>Type</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {todos.items.map((item, index) => (
                <tr key={`${item.path}:${item.line}:${index}`} className="align-top">
                  <td className="rp-mono">{item.path}</td>
                  <td className="font-mono">{item.line}</td>
                  <td>
                    <span
                      className={`rp-status-pill ${
                        item.kind === "FIXME"
                          ? "rp-status-pill--failed"
                          : "rp-status-pill--queued"
                      }`}
                    >
                      <span className="rp-status-dot" aria-hidden="true" />
                      {item.kind}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-text-secondary">
                    {item.matchedText}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No TODO or FIXME markers found"
          description="No matching items were found in the scanned source files."
        />
      )}
    </SectionCard>
  );
}
