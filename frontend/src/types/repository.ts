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
  license: string;
  createdAt: string;
  updatedAt: string;
  openIssues: number;
}

export interface TreeNode {
  name: string;
  type: "directory" | "file";
  children: TreeNode[];
}
