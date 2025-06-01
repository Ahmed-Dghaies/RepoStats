import backendApi from "@/utils/axios/axios";
import { TreeItem, Contributor, RepositoryInfo, PullRequest } from "@/types/repository";
import { FormattedGraphData, FormattedLanguageData, GraphData } from "@/types/graphs";
import {
  formatClonesData,
  formatGraphViewsData,
  formatLanguagesData,
  formatPunchCardData,
} from "@/utils/graphs/dataPreparation";
import { AxiosError } from "axios";
import { SemgrepResult } from "../components/CodeAnalysis/types";

export interface FormattedGraphComparisonData {
  keys: string[];
  maximumValue: number;
  count: GraphData;
  uniquesCount: GraphData;
}

interface RepositoryIdentifier {
  owner: string;
  repository: string;
  signal?: AbortSignal;
}

export const fetchClonesStatistics = async ({
  owner,
  repository,
}: RepositoryIdentifier): Promise<FormattedGraphComparisonData> => {
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
}: RepositoryIdentifier): Promise<FormattedGraphComparisonData> => {
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
}: RepositoryIdentifier): Promise<FormattedLanguageData> => {
  const result = await backendApi
    .get(`/repository/${owner}/${repository}/languages`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return {};
    });
  return formatLanguagesData(result);
};

export const fetchRepositoryPunchCard = async ({
  owner,
  repository,
}: RepositoryIdentifier): Promise<FormattedGraphData> => {
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
}: RepositoryIdentifier): Promise<RepositoryInfo> => {
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

export const runStaticAnalysis = async ({
  owner,
  repository,
}: {
  owner: string;
  repository: string;
}): Promise<SemgrepResult> => {
  return await backendApi
    .get(`/repository/${owner}/${repository}/static-analysis`)
    .then((response: { data: SemgrepResult }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return { results: [], errors: [error.message || "Analysis failed"], status: "error" };
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
  await backendApi.get(`/repository/${owner}/${repository}/${branch}/download`);
};

export const fetchRepositoryContributors = async ({
  owner,
  repository,
}: RepositoryIdentifier): Promise<Contributor[]> => {
  try {
    const contributors = await backendApi.get(`/repository/${owner}/${repository}/contributors`);
    return contributors.data;
  } catch (error) {
    console.error(`Error fetching contributors:`, error);
    return [];
  }
};

/**
 * Retrieves the source tree of a specified branch in a GitHub repository.
 *
 * If no branch is provided, the repository's default branch is used.
 *
 * @param owner - The repository owner's username.
 * @param repository - The name of the repository.
 * @param branch - The branch to fetch the source tree from. If omitted, the default branch is used.
 * @returns The root {@link TreeItem} of the repository's source tree, or null if the tree cannot be retrieved.
 */
export async function fetchGitHubRepoTree({
  owner,
  repository,
  branch,
}: {
  owner: string;
  repository: string;
  branch?: string;
}): Promise<TreeItem[] | null> {
  if (!branch) {
    const repositoryDetails = await fetchRepositoryDetails({ owner, repository });
    if (repositoryDetails !== null) branch = repositoryDetails.defaultBranch;
  }
  return await backendApi
    .get(`/repository/${owner}/${repository}/${branch}/source-tree`)
    .then((response: { data: TreeItem[] }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
    });
}

interface MergedPullRequestsDetails {
  mergedPullRequests: PullRequest[];
  averageTimeToMergeHours: number;
}

/**
 * Retrieves details about merged pull requests for a given repository.
 *
 * @param owner - The repository owner's username.
 * @param repository - The repository name.
 * @returns An object containing merged pull request data, total count, and average time to merge. Returns default empty values if the request fails.
 */
export async function fetchMergedPullRequestsDetails({
  owner,
  repository,
  signal,
}: RepositoryIdentifier): Promise<MergedPullRequestsDetails> {
  return await backendApi
    .get(`/repository/${owner}/${repository}/merged-pull-requests`, { signal })
    .then((response: { data: any; total: number; timeToMerge: number }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
      return { averageTimeToMergeHours: 0, mergedPullRequests: [] };
    });
}

/**
 * Retrieves and formats heat map activity data for a GitHub repository.
 *
 * @param owner - The repository owner's username.
 * @param repository - The repository name.
 * @returns An object containing an array of date/count pairs and the maximum count value.
 */
export async function fetchHeatMapData({ owner, repository }: RepositoryIdentifier) {
  let maximumValue = 0;
  return await backendApi
    .get(`/repository/${owner}/${repository}/heat-map`)
    .then((response: { data: Record<string, number> }) => {
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

/**
 * Checks whether the specified repository contains a dependencies file.
 *
 * @param repositoryDetails - Information about the repository to check.
 * @returns A promise that resolves to true if a dependencies file exists, false if not, or undefined if the check fails.
 */
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
      return false;
    });
}

/**
 * Retrieves the content of a file at the specified path within a repository.
 *
 * @param repositoryDetails - Information about the repository, including owner and name.
 * @param path - The file path within the repository.
 * @returns The file content as a string, or `undefined` if the request fails.
 */
export async function fetchFileContent({
  repositoryDetails,
  path,
}: {
  repositoryDetails: RepositoryInfo;
  path: string;
}): Promise<string> {
  return await backendApi
    .get(
      `/repository/${repositoryDetails.owner.login}/${
        repositoryDetails.name
      }/file/${encodeURIComponent(path)}`
    )
    .then((response: { data: boolean }) => response.data)
    .catch((error: any) => {
      console.error(`Github API error: ${error}`);
      return "";
    });
}
