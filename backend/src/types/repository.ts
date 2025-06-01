export interface GithubRepositoryDetails {
  name: string;
  full_name: string;
  default_branch: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  stargazers_count: number;
  license: {
    name: string;
  };
  description: string;
  size: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  forks_count: number;
  watchers_count: number;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  url: string;
}
