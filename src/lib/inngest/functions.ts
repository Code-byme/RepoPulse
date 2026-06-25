import { inngest } from "@/lib/inngest/client";
import { ANALYZE_REPOSITORY_EVENT } from "@/lib/inngest/events";
import { runAnalyzeRepositoryWorkflow } from "@/server/workflows/analyze-repository.workflow";

export const analyzeRepositoryFunction = inngest.createFunction(
  {
    id: "analyze-repository",
    name: "Analyze GitHub Repository",
    triggers: [{ event: ANALYZE_REPOSITORY_EVENT }],
    concurrency: {
      limit: 1,
      key: "event.data.repositoryId",
    },
  },
  async ({ event, step, runId }) => {
    const { jobId, repositoryId } = event.data;

    const result = await step.run("run-analysis-workflow", async () => {
      return runAnalyzeRepositoryWorkflow({
        jobId,
        repositoryId,
        inngestRunId: runId,
      });
    });

    return {
      jobId,
      repositoryId,
      status: result.status,
    };
  },
);

export const inngestFunctions = [analyzeRepositoryFunction];
