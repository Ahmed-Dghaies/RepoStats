export interface GitHubPR {
  title: string;
  user: {
    login: string;
  };
  created_at: string;
  merged_at: string | null;
  html_url: string;
  number: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
}
