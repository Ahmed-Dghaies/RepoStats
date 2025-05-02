export interface PackageDetails {
  name: string | null;
  author: string | null;
  organization: string | null;
  usedVersion: string | null;
  latestVersion: string | null;
  lastUpdate: string | null;
  description: string | null;
  dependencyScore: number | null;
}
