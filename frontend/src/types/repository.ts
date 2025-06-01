export interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  email?: string;
}

export type Repository = {
  repository: string;
  owner: string;
  lastUpdated: string;
  url: string;
};

export interface RepositoryInfo {
  name: string;
  owner: Contributor;
  defaultBranch: string;
  fullName: string;
  description: string;
  releases: {
    latestRelease: {
      tagName: string;
      releaseDate: string;
    } | null;
    nbReleases: number;
  };
  languages: Record<string, number>;
  size: string;
  stars: number;
  forkCount: number;
  watchersCount: number;
  license: string;
  createdAt: string;
  updatedAt: string;
  openIssues: number;
  projectType: string;
  readme: string | null;
  dependencyFile: string | null;
  lastUpdated?: string;
}

export interface TreeItem {
  path: string;
  type: "blob" | "tree";
  children?: TreeItem[];
}

export interface PullRequest {
  title: string;
  number: number;
  author: string;
  createdAt: string;
  mergedAt: string | null;
  durationInHours: number;
  state: string;
  url: string;
}
