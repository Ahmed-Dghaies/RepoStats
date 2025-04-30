interface RepositoryDetails {
  platform: string;
  organization: string;
  repository: string;
}

/**
 * Extracts repository details from a URL string.
 *
 * Parses the given URL and returns an object containing the platform (hostname), organization (first path segment), and repository (second path segment). Returns null if the URL is invalid or does not contain at least two path segments.
 *
 * @param url - The URL string to parse.
 * @returns The extracted repository details, or null if extraction fails.
 */
export function extractRepositoryDetailsFromUrl(url: string): RepositoryDetails | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);
    if (pathSegments.length < 2) return null;

    // Handle GitLab subgroups (all but last segment form the organization)
    if (urlObj.hostname.includes("gitlab") && pathSegments.length > 2) {
      return {
        platform: urlObj.hostname,
        organization: pathSegments.slice(0, -1).join("/"),
        repository: pathSegments[pathSegments.length - 1],
      };
    }

    return {
      platform: urlObj.hostname,
      organization: pathSegments[0],
      repository: pathSegments[1],
    };
  } catch (error) {
    console.error(`Could not retrieve repository details from ${url}: ${error}`);
    return null;
  }
}
