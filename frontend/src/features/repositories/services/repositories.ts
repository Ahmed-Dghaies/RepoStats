import GitHub, { getHeaders } from "@/utils/axios/axios";
import { AppDispatch } from "../../../store";
import { Repository, TreeNode } from "@/types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";
import { FormattedGraphData, GraphData } from "@/types/graphs";
import {
  Contributor,
  RepositoryInfo,
} from "@/pages/RepoStats/types/repository";
import {
  formatClonesData,
  formatGraphViewsData,
  formatPunchCardData,
} from "@/utils/graphs/dataPreparation";

export const fetchAllRepositories = () => async (dispatch: AppDispatch) => {
  const result: Array<Repository> = JSON.parse(
    localStorage.getItem("repositories") ?? "[]"
  );
  dispatch(setRepositories(result));
};

export interface FormattedGraphComparisonData {
  keys: string[];
  maximumValue: number;
  count: GraphData;
  uniquesCount: GraphData;
}

export const fetchClonesStatistics = async ({
  owner,
  name,
}: Partial<Repository>): Promise<FormattedGraphComparisonData> => {
  const headers = getHeaders();
  const result = await GitHub.get(
    `/repos/${owner}/${name}/traffic/clones`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  return formatClonesData(result);
};

export const fetchRepositoryViews = async ({
  owner,
  name,
}: Partial<Repository>): Promise<FormattedGraphComparisonData> => {
  const headers = getHeaders();
  const result = await GitHub.get(
    `/repos/${owner}/${name}/traffic/views`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  return formatGraphViewsData(result);
};

export const fetchRepositoryPunchCard = async ({
  owner,
  name,
}: Partial<Repository>): Promise<FormattedGraphData> => {
  const headers = getHeaders();
  const result = await GitHub.get(
    `/repos/${owner}/${name}/stats/punch_card`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  return formatPunchCardData(result);
};

export const fetchRepositoryDetails = async ({
  owner,
  name,
}: Partial<Repository>): Promise<RepositoryInfo> => {
  const headers = getHeaders();
  const result = await GitHub.get(`/repos/${owner}/${name}`, headers)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  const releases = await GitHub.get(`/repos/${owner}/${name}/releases`, headers)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  return {
    name: result.name,
    fullName: result.full_name,
    defaultBranch: result.default_branch,
    owner: {
      login: result.owner.login,
      avatarUrl: result.owner.avatar_url,
      contributions: 0,
    },
    description: result.description,
    releases: {
      latestRelease:
        releases.length > 0
          ? {
              tagName: releases[0].tag_name,
              releaseDate: releases[0].published_at,
            }
          : null,
      nbReleases: releases.length,
    },
    openIssues: result.open_issues_count,
    createdAt: new Date(result.created_at).toISOString().split("T")[0],
    updatedAt: result.updated_at,
  };
};

export const downloadRepository = ({
  owner,
  name,
  branch,
}: {
  owner: string;
  name: string;
  branch: string;
}): void => {
  if (!owner || !name) {
    console.error("Owner and repository name are required.");
    return;
  }

  const url = `https://github.com/${owner}/${name}/archive/refs/heads/${branch}.zip`;

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.zip`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
};

export const fetchRepositoryContributors = async ({
  owner,
  name,
}: Partial<Repository>): Promise<Contributor[]> => {
  const headers = getHeaders();

  try {
    const response = await GitHub.get(
      `/repos/${owner}/${name}/contributors`,
      headers
    );
    const contributors = response.data;

    const resolvedContributors = await Promise.all(
      contributors.map(async (user: any) => {
        try {
          const userDataResponse = await GitHub.get(
            `/users/${user.login}`,
            getHeaders()
          );
          const userData = userDataResponse.data;

          return {
            login: user.login,
            contributions: user.contributions,
            avatarUrl: user.avatar_url,
            email: userData.email,
          };
        } catch (error) {
          console.error(
            `Error while retrieving user data for ${user.login}:`,
            error
          );
          return {
            login: user.login,
            contributions: user.contributions,
            avatarUrl: user.avatar_url,
          };
        }
      })
    );

    return resolvedContributors;
  } catch (error) {
    console.error(`Error fetching contributors:`, error);
    return [];
  }
};

interface GitHubTreeItem {
  path: string;
  type: "tree" | "blob";
}

export async function fetchGitHubRepoTree({
  owner,
  name,
  branch,
}: {
  owner: string;
  name: string;
  branch?: string;
}): Promise<TreeNode | null> {
  const headers = getHeaders();
  if (!branch) {
    const repository = await GitHub.get(`/repos/${owner}/${name}`, headers)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        console.error(error);
        return [];
      });
    branch = repository.default_branch;
  }
  return await GitHub.get(
    `https://api.github.com/repos/${owner}/${name}/git/trees/${branch}?recursive=1`,
    headers
  )
    .then((response: { data: { tree: any; GitHubTreeItem: any } }) => {
      try {
        if (!response.data.tree) {
          throw new Error("Invalid repository structure");
        }
        const { tree }: { tree: GitHubTreeItem[] } = response.data;
        const root: TreeNode = { name, type: "directory", children: [] };
        tree.forEach((item) => {
          const parts = item.path.split("/");
          let current = root;

          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;
            let existing = current.children?.find(
              (child) => child.name === part
            );
            if (!existing) {
              existing = {
                name: part,
                type: isLast && item.type === "blob" ? "file" : "directory",
                children: [],
              };
              current.children?.push(existing);
            }

            if (!isLast) {
              current = existing;
            }
          }
        });
        return root;
      } catch (error: any) {
        console.error(`Error fetching repository structure: ${error}`);
        return null;
      }
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}
