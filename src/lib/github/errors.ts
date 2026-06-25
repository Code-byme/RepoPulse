import { GithubApiError, GithubNetworkError } from "@/lib/github/client";

export function parseGithubErrorMessage(
  body: unknown,
  fallback: string,
): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    return typeof message === "string" ? message : fallback;
  }

  return fallback;
}

export function toUserFacingGithubMessage(error: GithubApiError): string {
  switch (error.status) {
    case 404:
      return "Repository not found on GitHub. Check that the URL is correct and the repository is public.";
    case 401:
      return "GitHub authentication failed. Verify GITHUB_TOKEN is configured correctly.";
    case 403:
      return "GitHub API access denied or rate limit exceeded. Try again later or configure GITHUB_TOKEN.";
    case 429:
      return "GitHub API rate limit exceeded. Try again later or configure GITHUB_TOKEN.";
    default:
      return error.message;
  }
}

export function classifyAnalysisError(error: unknown): string {
  if (error instanceof GithubApiError) {
    return toUserFacingGithubMessage(error);
  }

  if (error instanceof GithubNetworkError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Analysis failed due to an unexpected error";
}
