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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium text-zinc-500">Path</th>
                <th className="py-2 pr-4 font-medium text-zinc-500">Line</th>
                <th className="py-2 pr-4 font-medium text-zinc-500">Type</th>
                <th className="py-2 font-medium text-zinc-500">Text</th>
              </tr>
            </thead>
            <tbody>
              {todos.items.map((item, index) => (
                <tr
                  key={`${item.path}:${item.line}:${index}`}
                  className="border-b border-zinc-100 align-top dark:border-zinc-900"
                >
                  <td className="py-2 pr-4 font-mono text-xs">{item.path}</td>
                  <td className="py-2 pr-4">{item.line}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={
                        item.kind === "FIXME"
                          ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950/50 dark:text-red-300"
                          : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      }
                    >
                      {item.kind}
                    </span>
                  </td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300">
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
