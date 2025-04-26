import axios from "axios";
import { githubAPI } from "../../config/githubService";
import { Response } from "express";
import { GithubUser } from "../user/types";
import { base64ToMarkdown } from "./utils";
import { githubRepositoryDetails } from "../../types/repository";
import { GitHubCommit, GitHubPR } from "../../types/github";

interface getCommitsPayload {
  owner: string;
  repository: string;
  since: string;
  until: string;
  commitsPerPage: number;
  currentPage: number;
}

interface RequestsPayload {
  owner: string;
  repository: string;
  branch?: string;
}

export class RepositoryServices {
  public static getSourceTree = async ({ owner, repository, branch }: RequestsPayload) => {
    const response = await githubAPI.get(
      `/repos/${owner}/${repository}/git/trees/${branch}?recursive=1`
    );
    return response.data;
  };

  public static getBranches = async ({ owner, repository }: RequestsPayload) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/branches`);
    return response.data.map((branch: { name: string }) => branch.name);
  };

  public static getPRDetails = async ({ owner, repository }: RequestsPayload) => {
    try {
      const perPage = 30;
      const response = await githubAPI.get(`/repos/${owner}/${repository}/pulls`, {
        params: {
          state: "closed",
          sort: "updated",
          direction: "desc",
          per_page: perPage,
        },
      });

      const mergedPRs = response.data.filter((pr: GitHubPR) => pr.merged_at).slice(0, 5);

      interface formattedPR {
        title: string;
        author: string;
        created_at: string;
        merged_at: string;
        duration_in_hours: string;
        url: string;
      }

      const mergedWithDurations = mergedPRs.map((pr: GitHubPR) => {
        const created = new Date(pr.created_at);
        const merged = new Date(pr.merged_at);
        const durationInHours = (merged.getTime() - created.getTime()) / (1000 * 60 * 60);
        return {
          title: pr.title,
          author: pr.user.login,
          created_at: pr.created_at,
          merged_at: pr.merged_at,
          duration_in_hours: durationInHours.toFixed(2),
          url: pr.html_url,
        };
      });

      const totalDuration = mergedWithDurations.reduce(
        (sum: number, pr: formattedPR) => sum + parseFloat(pr.duration_in_hours),
        0
      );
      const averageDuration =
        mergedWithDurations.length > 0
          ? (totalDuration / mergedWithDurations.length).toFixed(2)
          : null;

      return {
        last5Merged: mergedWithDurations,
        averageTimeToMergeHours: averageDuration,
      };
    } catch (error) {
      return {
        last5Merged: [],
        averageTimeToMergeHours: null,
      };
    }
  };

  public static getHeatMapData = async ({ owner, repository, includeAllBranches = false }) => {
    const since = new Date();
    since.setDate(since.getDate() - 240);
    const isoSince = since.toISOString();

    const contributionsByDay = {};
    const perPage = 100;

    let branches: string[] = [];

    if (includeAllBranches) {
      branches = await RepositoryServices.getBranches({ owner, repository });
    } else {
      const repoResponse = await githubAPI.get(`/repos/${owner}/${repository}`);
      branches = [repoResponse.data.default_branch];
    }

    for (const branch of branches) {
      let page = 1;

      while (true) {
        const response = await githubAPI.get(`/repos/${owner}/${repository}/commits`, {
          params: {
            sha: branch,
            since: isoSince,
            per_page: perPage,
            page,
          },
        });

        const commits = response.data;

        if (commits.length === 0) break;

        commits.forEach((commit: GitHubCommit) => {
          const date = new Date(commit.commit.author.date).toISOString().split("T")[0];
          contributionsByDay[date] = (contributionsByDay[date] || 0) + 1;
        });

        if (commits.length < perPage) break;

        page++;
      }
    }

    return contributionsByDay;
  };

  public static getReadmeFileName = async (
    owner: string,
    repository: string
  ): Promise<string | null> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contents`);

    const filenames = ["readme", "readme.md", "readme.txt", "readme.rst", "readme.adoc"];
    const file = response.data.find((file: { name: string }) =>
      filenames.includes(file.name.toLowerCase())
    );

    return file ? file.name : null;
  };

  public static getProjectType = async (
    owner: string,
    repository: string
  ): Promise<{ type: string; dependencyFile: string }> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contents`);

    const files = response.data.map((file: { name: string }) => file.name.toLowerCase());

    const dependencyFiles = {
      node: "package.json",
      python: files.includes("requirements.txt")
        ? "requirements.txt"
        : files.includes("pyproject.toml")
        ? "pyproject.toml"
        : null,
      php: "composer.json",
      rust: "Cargo.toml",
      go: "go.mod",
      "c++": files.includes("CMakeLists.txt")
        ? "CMakeLists.txt"
        : files.find((f: string) => f.endsWith(".cpp") || f.endsWith(".h")) || null,
    };

    for (const [type, file] of Object.entries(dependencyFiles)) {
      if (file && files.includes(file.toLowerCase())) {
        return { type, dependencyFile: file };
      }
    }

    return { type: "unknown", dependencyFile: null };
  };

  public static getPunchCard = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/stats/punch_card`);
    return response.data;
  };

  public static getContributors = async (
    owner: string,
    repository: string
  ): Promise<GithubUser[]> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contributors`);
    return response.data;
  };

  public static download = async ({ owner, repository, branch }, res: Response) => {
    const url = `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`;

    const response = await axios.get(url, { responseType: "stream" });

    res.setHeader("Content-Disposition", `attachment; filename=${repository}-${branch}.zip`);
    res.setHeader("Content-Type", "application/zip");

    response.data.pipe(res);
  };

  public static getReleases = async (
    owner: string,
    repository: string
  ): Promise<{ latest: { tag_name: string; published_at: string }; nbReleases: number }> => {
    const releasesRequestUrl = `/repos/${owner}/${repository}/releases?per_page=100`;
    const response = await githubAPI.get(releasesRequestUrl);
    const linkHeader = response.headers.link;

    let totalReleases = response.data.length;
    let lastPage = 1;

    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        lastPage = parseInt(lastPageMatch[1], 10);
      }
    }

    if (lastPage > 1) {
      const lastPageUrl = `${releasesRequestUrl}&page=${lastPage}`;
      const lastPageResponse = await githubAPI.get(lastPageUrl);
      totalReleases = (lastPage - 1) * 100 + lastPageResponse.data.length;
    }
    const formattedResponse = {
      latest: response.data.length ? response.data[0] : null,
      nbReleases: totalReleases,
    };
    return formattedResponse;
  };

  public static getViews = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/views`);
    return response.data;
  };

  public static getClonesData = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/clones`);
    return response.data;
  };

  public static getDetails = async (
    owner: string,
    repository: string
  ): Promise<githubRepositoryDetails> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}`);
    return response.data;
  };

  public static getLanguages = async (
    owner: string,
    repository: string
  ): Promise<Record<string, number>> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/languages`);
    return response.data;
  };

  public static getCommits = async (payload: getCommitsPayload) => {
    const { owner, repository, commitsPerPage, currentPage, since, until } = payload;

    let queryParams: string = `?since=${since}&until=${until}`;
    if (commitsPerPage) {
      queryParams += `&per_page=${commitsPerPage}`;
      if (currentPage) {
        queryParams += `&page=${currentPage}`;
      }
    }
    const response = await githubAPI.get(`/repos/${owner}/${repository}/commits${queryParams}`);
    return response.data;
  };

  public static getFile = async ({
    owner,
    repository,
    path,
  }: {
    owner: string;
    repository: string;
    path: string;
  }) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contents/${path}`);
    if (response.status === 200 && response.data?.content) {
      return base64ToMarkdown(response.data.content);
    }
    return null;
  };
}
