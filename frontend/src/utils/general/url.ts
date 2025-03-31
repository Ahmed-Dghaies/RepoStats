interface RepositoryDetails {
  platform: string;
  organization: string;
  repository: string;
}

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
