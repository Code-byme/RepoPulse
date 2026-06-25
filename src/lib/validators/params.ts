import { z } from "zod";

export const uuidParamSchema = z.string().uuid("Invalid ID format");

export function parseUuidParam(value: string): string {
  return uuidParamSchema.parse(value);
}
