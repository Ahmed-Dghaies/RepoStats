import GitHub, { getHeaders } from "@/utils/axios/axios";
import { AppDispatch } from "../../../store";
import { Repository } from "@/types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";
import {
  formatClonesData,
  formatGraphViewsData,
  formatPunchCardData,
} from "@/utils/graphs/lineGraph";
import { FormattedGraphData, GraphData } from "@/types/graphs";
import {
  Contributor,
  RepositoryInfo,
} from "@/pages/RepoStats/types/repository";

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
  console.log(headers);
  const result = await GitHub.get(
    `/repos/${owner}/${name}/traffic/clones`,
    headers
  )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      return [];
    });
  const releases = await GitHub.get(`/repos/${owner}/${name}/releases`, headers)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
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
