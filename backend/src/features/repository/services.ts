import axios from "axios";
import { githubAPI } from "../../config/githubService";
import { Response } from "express";
import { GithubUser } from "../user/types";
import { base64ToMarkdown } from "./utils";
import { githubRepositoryDetails } from "../../types/repository";

interface getCommitsPayload {
  owner: string;
  repository: string;
  since: string;
  until: string;
  commitsPerPage: number;
  currentPage: number;
}

export class RepositoryServices {
  public static getSourceTree = async ({ owner, repository, branch }) => {
    const response = await githubAPI.get(
      `/repos/${owner}/${repository}/git/trees/${branch}?recursive=1`
    );
    return response.data;
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
