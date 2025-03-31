import backendApi from "@/utils/axios/axios";
import { AppDispatch } from "../../../store";
import { Repository, TreeNode, Contributor, RepositoryInfo } from "@/types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";
import { FormattedGraphData, GraphData } from "@/types/graphs";
import {
  formatClonesData,
  formatGraphViewsData,
  formatPunchCardData,
} from "@/utils/graphs/dataPreparation";

export const fetchAllRepositories = () => async (dispatch: AppDispatch) => {
  const result: Array<Repository> = JSON.parse(localStorage.getItem("repositories") ?? "[]");
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
  repository,
}: Partial<Repository>): Promise<FormattedGraphComparisonData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${repository}/traffic/clones`)
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
  repository,
}: Partial<Repository>): Promise<FormattedGraphComparisonData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${repository}/traffic/views`)
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
  repository,
}: Partial<Repository>): Promise<FormattedGraphData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${repository}/punch-card`)
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
  repository,
}: Partial<Repository>): Promise<RepositoryInfo> => {
  return await backendApi
    .get(`/repository/${owner}/${repository}/details`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return {};
    });
};

export const downloadRepository = async ({
  owner,
  repository,
  branch,
}: {
  owner: string;
  repository: string;
  branch: string;
}): Promise<void> => {
  await backendApi.get(`repository/${owner}/${repository}/${branch}/download`);
};

export const fetchRepositoryContributors = async ({
  owner,
  repository,
}: Partial<Repository>): Promise<Contributor[]> => {
  try {
    const contributors = await backendApi.get(`/repository/${owner}/${repository}/contributors`);
    return contributors.data;
  } catch (error) {
    console.error(`Error fetching contributors:`, error);
    return [];
  }
};

export async function fetchGitHubRepoTree({
  owner,
  repository,
  branch,
}: {
  owner: string;
  repository: string;
  branch?: string;
}): Promise<TreeNode | null> {
  if (!branch) {
    const repositoryDetails = await fetchRepositoryDetails({ owner, repository });
    branch = repositoryDetails.defaultBranch;
  }
  return await backendApi
    .get(`/repository/${owner}/${repository}/${branch}/source-tree`)
    .then((response: { data: TreeNode }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}

export async function repositoryHasDependenciesFile(
  repositoryDetails: RepositoryInfo
): Promise<boolean> {
  return await backendApi
    .get(
      `/repository/${repositoryDetails.owner.login}/${repositoryDetails.name}/has-dependencies-file`
    )
    .then((response: { data: boolean }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}

export async function fetchFileContent({
  repositoryDetails,
  path,
}: {
  repositoryDetails: RepositoryInfo;
  path: string;
}): Promise<string> {
  return await backendApi
    .get(`/repository/${repositoryDetails.owner.login}/${repositoryDetails.name}/file/${path}`)
    .then((response: { data: boolean }) => response.data)
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}
