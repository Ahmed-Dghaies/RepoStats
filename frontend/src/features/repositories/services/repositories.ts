import backendApi from "@/utils/axios/axios";
import { AppDispatch } from "../../../store";
import { Repository, TreeNode } from "@/types/repository";
import { setRepositories } from "../reducers/repositoriesReducer";
import { FormattedGraphData, GraphData } from "@/types/graphs";
import { Contributor, RepositoryInfo } from "@/pages/RepoStats/types/repository";
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
  name,
}: Partial<Repository>): Promise<FormattedGraphComparisonData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${name}/traffic/clones`)
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
  const result = await backendApi
    .get(`/repository/${owner}/${name}/traffic/views`)
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
  const result = await backendApi
    .get(`/repository/${owner}/${name}/punch-card`)
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
  return await backendApi
    .get(`/repository/${owner}/${name}/details`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
};

export const downloadRepository = async ({
  owner,
  name,
  branch,
}: {
  owner: string;
  name: string;
  branch: string;
}): Promise<void> => {
  await backendApi.get(`repository/${owner}/${name}/${branch}/download`);
};

export const fetchRepositoryContributors = async ({
  owner,
  name,
}: Partial<Repository>): Promise<Contributor[]> => {
  try {
    const contributors = await backendApi.get(`/repository/${owner}/${name}/contributors`);
    return contributors.data;
  } catch (error) {
    console.error(`Error fetching contributors:`, error);
    return [];
  }
};

export async function fetchGitHubRepoTree({
  owner,
  name,
  branch,
}: {
  owner: string;
  name: string;
  branch?: string;
}): Promise<TreeNode | null> {
  return await backendApi
    .get(`/repository/${owner}/${name}/${branch}/source-tree`)
    .then((response: { data: TreeNode }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}
