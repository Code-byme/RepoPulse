export type ParsedGithubRepo = {
  owner: string;
  name: string;
  fullName: string;
  normalizedUrl: string;
};

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

const OWNER_NAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;

function isValidOwnerOrName(value: string): boolean {
  return OWNER_NAME_PATTERN.test(value);
}

function buildNormalizedUrl(owner: string, name: string): string {
  return `https://github.com/${owner}/${name}`;
}

function parseFromPathname(pathname: string): ParsedGithubRepo | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  const [owner, name, ...rest] = segments;

  if (!owner || !name || rest.length > 0) {
    return null;
  }

  const cleanName = name.replace(/\.git$/, "").toLowerCase();
  const normalizedOwner = owner.toLowerCase();

  if (!isValidOwnerOrName(normalizedOwner) || !isValidOwnerOrName(cleanName)) {
    return null;
  }

  return {
    owner: normalizedOwner,
    name: cleanName,
    fullName: `${normalizedOwner}/${cleanName}`,
    normalizedUrl: buildNormalizedUrl(normalizedOwner, cleanName),
  };
}

export function parseGithubRepoUrl(input: string): ParsedGithubRepo | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);

    if (!GITHUB_HOSTS.has(url.hostname.toLowerCase())) {
      return null;
    }

    return parseFromPathname(url.pathname);
  } catch {
    return parseFromPathname(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
  }
}

export function normalizeGithubRepoUrl(input: string): string {
  const parsed = parseGithubRepoUrl(input);

  if (!parsed) {
    throw new Error("Invalid GitHub repository URL");
  }

  return parsed.normalizedUrl;
}

export function extractOwnerAndName(
  input: string,
): Pick<ParsedGithubRepo, "owner" | "name" | "fullName"> {
  const parsed = parseGithubRepoUrl(input);

  if (!parsed) {
    throw new Error("Invalid GitHub repository URL");
  }

  return {
    owner: parsed.owner,
    name: parsed.name,
    fullName: parsed.fullName,
  };
}
