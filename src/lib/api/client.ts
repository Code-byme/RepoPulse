import type {
  AnalysisJobDetailResponse,
  RepositoryDetailResponse,
  RepositoryReportResponse,
  SubmitAnalysisResponse,
} from "@/types/api";

export class ApiClientError extends Error {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.details = details;
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

function formatValidationDetails(details: unknown): string | null {
  if (!details || typeof details !== "object") {
    return null;
  }

  const fieldErrors = (details as { fieldErrors?: Record<string, string[]> })
    .fieldErrors;

  if (!fieldErrors) {
    return null;
  }

  const messages = Object.entries(fieldErrors).flatMap(([field, errors]) =>
    errors.map((error) => `${field}: ${error}`),
  );

  return messages.length > 0 ? messages.join(". ") : null;
}

export async function submitRepositoryAnalysis(
  repoUrl: string,
): Promise<SubmitAnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repoUrl }),
  });

  const data = await parseJsonResponse<{ error?: string; details?: unknown } & SubmitAnalysisResponse>(
    response,
  );

  if (!response.ok) {
    const validationMessage = formatValidationDetails(data.details);
    throw new ApiClientError(
      validationMessage ?? data.error ?? "Failed to submit repository",
      data.details,
    );
  }

  return data;
}

export async function fetchAnalysisJob(
  jobId: string,
): Promise<AnalysisJobDetailResponse> {
  const response = await fetch(`/api/jobs/${jobId}`);
  const data = await parseJsonResponse<{ error?: string } & AnalysisJobDetailResponse>(
    response,
  );

  if (!response.ok) {
    throw new ApiClientError(data.error ?? "Failed to fetch job");
  }

  return data;
}

export async function fetchRepositoryDetail(
  repositoryId: string,
): Promise<RepositoryDetailResponse> {
  const response = await fetch(`/api/repositories/${repositoryId}`);
  const data = await parseJsonResponse<{ error?: string } & RepositoryDetailResponse>(
    response,
  );

  if (!response.ok) {
    throw new ApiClientError(data.error ?? "Failed to fetch repository");
  }

  return data;
}

export async function fetchRepositoryReport(
  repositoryId: string,
): Promise<RepositoryReportResponse> {
  const response = await fetch(`/api/repositories/${repositoryId}/report`);
  const data = await parseJsonResponse<{ error?: string } & RepositoryReportResponse>(
    response,
  );

  if (!response.ok) {
    throw new ApiClientError(data.error ?? "Failed to fetch repository report");
  }

  return data;
}
