export async function parseJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type");

  if (contentType && !contentType.includes("application/json")) {
    throw new SyntaxError("Expected application/json content type");
  }

  const text = await request.text();

  if (!text.trim()) {
    throw new SyntaxError("Request body is empty");
  }

  return JSON.parse(text) as unknown;
}
