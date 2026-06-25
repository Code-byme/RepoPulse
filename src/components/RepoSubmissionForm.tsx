"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { ApiClientError, submitRepositoryAnalysis } from "@/lib/api/client";

export function RepoSubmissionForm() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setFormError(null);

    const trimmedUrl = repoUrl.trim();

    if (!trimmedUrl) {
      setFieldError("GitHub URL is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitRepositoryAnalysis(trimmedUrl);
      router.push(`/jobs/${result.jobId}`);
    } catch (error) {
      if (error instanceof ApiClientError) {
        const validationMessage =
          typeof error.details === "object" &&
          error.details !== null &&
          "fieldErrors" in error.details &&
          (error.details as { fieldErrors?: { repoUrl?: string[] } }).fieldErrors
            ?.repoUrl?.[0];

        if (validationMessage) {
          setFieldError(validationMessage);
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="GitHub repository URL"
        name="repoUrl"
        type="url"
        placeholder="https://github.com/vercel/next.js"
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        error={fieldError}
        disabled={isLoading}
        autoComplete="off"
        spellCheck={false}
      />

      {formError ? <ErrorMessage message={formError} /> : null}

      <Button type="submit" isLoading={isLoading} loadingText="Submitting…">
        Analyze Repository
      </Button>
    </form>
  );
}
