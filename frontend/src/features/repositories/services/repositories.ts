import backendApi from "@/utils/axios/axios";
import { Repository, TreeNode, Contributor, RepositoryInfo } from "@/types/repository";
import { FormattedGraphData, FormattedLanguageData, GraphData } from "@/types/graphs";
import {
  formatClonesData,
  formatGraphViewsData,
  formatLanguagesData,
  formatPunchCardData,
} from "@/utils/graphs/dataPreparation";
import { AxiosError } from "axios";

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

export const fetchRepositoryLanguages = async ({
  owner,
  repository,
}: Partial<Repository>): Promise<FormattedLanguageData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${repository}/languages`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return [];
    });
  return formatLanguagesData(result);
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
    .catch((error: AxiosError) => {
      console.error(error);
      return null;
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
    if (repositoryDetails !== null) branch = repositoryDetails.defaultBranch;
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

export async function fetchMergedPullRequestsDetails({ owner, repository }: Partial<Repository>) {
  return await backendApi
    .get(`/repository/${owner}/${repository}/merged-pull-requests`)
    .then((response: { data: any; total: number; timeToMerge: number }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
      return { data: [], total: 0, timeToMerge: 0 };
    });
}

export async function fetchHeatMapData({ owner, repository }: Partial<Repository>) {
  let maximumValue = 0;
  return await backendApi
    .get(`/repository/${owner}/${repository}/heat-map`)
    .then((response: { data: boolean }) => {
      const formattedData: { date: string; count: number }[] = [];

      Object.entries(response.data).forEach(([key, value]) => {
        formattedData.push({
          date: key,
          count: value,
        });
        maximumValue = Math.max(maximumValue, value);
      });
      return { data: formattedData, maximumValue };
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
      return { data: [], maximumValue };
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
