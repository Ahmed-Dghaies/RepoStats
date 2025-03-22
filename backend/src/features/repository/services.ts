import axios from "axios";
import { githubAPI } from "../../config/githubService";
import { Response } from "express";
import { GithubUser } from "../user/types";
import { base64ToMarkdown } from "./utils";

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
    try {
      const response = await githubAPI.get(
        `/repos/${owner}/${repository}/git/trees/${branch}?recursive=1`
      );
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository source tree: ${err}`);
    }
  };

  public static getPunchCard = async (owner: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/stats/punch_card`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository punch card: ${err}`);
    }
  };

  public static getContributors = async (
    owner: string,
    repository: string
  ): Promise<GithubUser[]> => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/contributors`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository contributors: ${err}`);
    }
  };

  public static download = async ({ owner, repository, branch }, res: Response) => {
    try {
      const url = `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`;

      const response = await axios.get(url, { responseType: "stream" });

      res.setHeader("Content-Disposition", `attachment; filename=${repository}-${branch}.zip`);
      res.setHeader("Content-Type", "application/zip");

      response.data.pipe(res);
    } catch (err) {
      throw new Error(`Error download repository from GitHub: ${err}`);
    }
  };

  public static getReleases = async (owner: string, repository: string) => {
    try {
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
    } catch (err) {
      throw new Error(`Error fetching repository releases from GitHub: ${err}`);
    }
  };

  public static getViews = async (owner: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/views`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository views from GitHub: ${err}`);
    }
  };

  public static getClonesData = async (owner: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/clones`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository clones stats from GitHub: ${err}`);
    }
  };

  public static getDetails = async (owner: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository stats from GitHub: ${err}`);
    }
  };

  public static getLanguages = async (owner: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/languages`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository languages from GitHub: ${err}`);
    }
  };

  public static getCommits = async (payload: getCommitsPayload) => {
    try {
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
    } catch (err) {
      throw new Error(`Error fetching repository commits from GitHub: ${err}`);
    }
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
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repository}/contents/${path}`);
      if (response.status === 200 && response.data?.content) {
        return base64ToMarkdown(response.data.content);
      }
      return null;
    } catch (err) {
      return false;
    }
  };
}
