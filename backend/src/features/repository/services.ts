import axios from "axios";
import { githubAPI } from "../../config/githubService";
import { Response } from "express";
import { GithubUser } from "../user/types";

interface getCommitsPayload {
  owner: string;
  repository: string;
  startDate: string;
  endDate: string;
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
      const response = await githubAPI.get(`repo/${owner}/${repository}/punch_card`);
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
      const response = await githubAPI.get(`/repos/${owner}/${name}/releases`);
      return response.data;
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

  public static getDetails = async (username: string, repository: string) => {
    try {
      const response = await githubAPI.get(`/repos/${username}/${repository}`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching repository stats from GitHub: ${err}`);
    }
  };

  public static getCommits = async (payload: getCommitsPayload) => {
    try {
      const { owner, repository, commitsPerPage, currentPage, startDate, endDate } = payload;

      let queryParams: string = `?since=${startDate}&until=${endDate}`;
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
}
