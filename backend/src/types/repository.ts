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
}
