import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  InvalidRepositoryUrlError,
  NotFoundError,
  ServiceError,
} from "@/server/errors";
import type { ApiErrorResponse } from "@/types/api";

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten(),
      },
      { status: 400 },
    );
  }

  if (error instanceof InvalidRepositoryUrlError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof ServiceError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.error("[api]", error);

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
