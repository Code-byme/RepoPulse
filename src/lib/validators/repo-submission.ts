import { z } from "zod";

import { parseGithubRepoUrl } from "@/lib/utils/github-url";

export const submitRepoSchema = z.object({
  repoUrl: z
    .string()
    .trim()
    .min(1, "GitHub URL is required")
    .refine((value) => parseGithubRepoUrl(value) !== null, {
      message: "Must be a valid public GitHub repository URL",
    }),
});

export type SubmitRepoInput = z.infer<typeof submitRepoSchema>;

export function parseSubmitRepoInput(input: unknown): SubmitRepoInput {
  return submitRepoSchema.parse(input);
}
