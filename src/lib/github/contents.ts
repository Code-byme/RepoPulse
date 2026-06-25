import type { GithubClient } from "@/lib/github/client";
import { GithubApiError } from "@/lib/github/client";
import { MAX_FILE_SIZE_BYTES } from "@/lib/github/constants";
import { decodeGithubFileContent } from "@/lib/github/decode";
import type { GithubContentResponse } from "@/lib/github/types";
import type { FileContent } from "@/types/github-analysis";

export async function fetchFileContent(
  client: GithubClient,
  owner: string,
  repo: string,
  path: string,
  ref?: string,
): Promise<FileContent | null> {
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const response = await client.request<GithubContentResponse>({
    path: `/repos/${owner}/${repo}/contents/${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}${query}`,
  });

  if (response.type !== "file") {
    return null;
  }

  if (response.size > MAX_FILE_SIZE_BYTES) {
    return null;
  }

  return {
    path: response.path,
    content: decodeGithubFileContent(response.content, response.encoding),
    size: response.size,
  };
}

export async function fetchFileContents(
  client: GithubClient,
  owner: string,
  repo: string,
  paths: string[],
  ref?: string,
  concurrency = 5,
): Promise<FileContent[]> {
  const results: FileContent[] = [];

  for (let index = 0; index < paths.length; index += concurrency) {
    const batch = paths.slice(index, index + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (path) => {
        try {
          return await fetchFileContent(client, owner, repo, path, ref);
        } catch (error) {
          if (error instanceof GithubApiError && error.status === 404) {
            return null;
          }

          console.warn(`[github] Failed to fetch ${path}:`, error);
          return null;
        }
      }),
    );

    for (const file of batchResults) {
      if (file) {
        results.push(file);
      }
    }
  }

  return results;
}
