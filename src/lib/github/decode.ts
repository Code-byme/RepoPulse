export function decodeGithubFileContent(
  content: string,
  encoding: string,
): string {
  if (encoding === "base64") {
    return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
  }

  return content;
}
