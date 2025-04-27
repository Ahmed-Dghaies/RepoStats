interface RepositoryDetails {
  platform: string;
  organization: string;
  repository: string;
}

/**
 * Extracts repository details from a URL string.
 *
 * Parses the input URL and returns an object containing the platform (hostname), organization (first path segment), and repository (second path segment). Returns null if the URL is invalid or does not contain enough path segments.
 *
 * @param url - The URL string to parse.
 * @returns An object with repository details, or null if extraction fails.
 */
export function extractRepositoryDetailsFromUrl(url: string): RepositoryDetails | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);
    if (pathSegments.length < 2) return null;
    return {
      platform: urlObj.hostname,
      organization: pathSegments[0],
      repository: pathSegments[1],
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return null;
  }
}
