import axios, { AxiosResponse } from "axios";
import { githubAPI } from "../../config/githubService";
import { Response } from "express";
import { GithubUser } from "../user/types";
import { base64ToMarkdown, locateDependencyFile } from "./utils";
import { GithubRepositoryDetails } from "../../types/repository";
import { GitHubCommit, GitHubPR } from "../../types/github";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { spawn } from "child_process";

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
  public static readonly getStaticAnalysis = async ({ owner, repository }, res: Response) => {
    console.info(`[${new Date().toISOString()}] Starting analysis for ${owner}/${repository}`);

    // Create temporary directory
    const tmpDir = path.join(os.tmpdir(), `semgrep-${owner}-${repository}-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });
    console.info(`[${new Date().toISOString()}] Created temp dir: ${tmpDir}`);

    // Clone the repository
    const cloneUrl = `https://github.com/${owner}/${repository}.git`;
    console.info(`[${new Date().toISOString()}] Cloning repository: ${cloneUrl}`);

    const cloneProcess = spawn("git", ["clone", "--depth", "1", cloneUrl, tmpDir]);

    cloneProcess.stdout.on("data", (data) => {
      console.info(`[${new Date().toISOString()}] GIT: ${data.toString().trim()}`);
    });

    cloneProcess.stderr.on("data", (data) => {
      console.info(`[${new Date().toISOString()}] GIT ERR: ${data.toString().trim()}`);
    });

    await new Promise((resolve, reject) => {
      cloneProcess.on("close", (code) => {
        if (code === 0) {
          console.info(`[${new Date().toISOString()}] Repository cloned successfully`);
          resolve(true);
        } else {
          reject(new Error(`Git clone failed with code ${code}`));
        }
      });
    });

    // Run Semgrep in Docker
    console.info(`[${new Date().toISOString()}] Starting Semgrep analysis in Docker...`);
    const dockerProcess = spawn("docker", [
      "run",
      "--rm",
      "-i",
      "-v",
      `${tmpDir}:/src`,
      "returntocorp/semgrep",
      "semgrep",
      "--config=auto",
      "--json",
      "--verbose", // Get more detailed output
      "--output=/src/semgrep-results.json",
      "/src",
    ]);

    // Log Docker output in real-time
    dockerProcess.stdout.on("data", (data) => {
      console.info(`[${new Date().toISOString()}] DOCKER: ${data.toString().trim()}`);
    });

    dockerProcess.stderr.on("data", (data) => {
      console.info(`[${new Date().toISOString()}] DOCKER ERR: ${data.toString().trim()}`);
    });

    await new Promise((resolve, reject) => {
      dockerProcess.on("close", (code) => {
        if (code === 0) {
          console.info(`[${new Date().toISOString()}] Semgrep analysis completed successfully`);
          resolve(true);
        } else {
          reject(new Error(`Semgrep failed with code ${code}`));
        }
      });
    });

    // Read results
    const resultsPath = path.join(tmpDir, "semgrep-results.json");
    const resultsJson = await fs.readFile(resultsPath, "utf-8");
    const results = JSON.parse(resultsJson);
    console.info(`[${new Date().toISOString()}] Found ${results.results?.length || 0} issues`);

    // Clean up
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.info(`[${new Date().toISOString()}] Cleaned up temp directory`);

    return {
      results: results.results || [],
      errors: results.errors || [],
      status: "success",
    };
  };

  public static readonly getSourceTree = async ({ owner, repository, branch }: RequestsPayload) => {
    let targetBranch = branch;
    if (!targetBranch) {
      const repoRes = await githubAPI.get(`/repos/${owner}/${repository}`);
      targetBranch = repoRes.data.default_branch;
    }
    const response = await githubAPI.get(
      `/repos/${owner}/${repository}/git/trees/${targetBranch}?recursive=1`
    );
    return response.data;
  };

  public static readonly getBranches = async ({ owner, repository }: RequestsPayload) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/branches`);
    return response.data.map((branch: { name: string }) => branch.name);
  };

  public static readonly getMergedPullRequests = async ({ owner, repository }: RequestsPayload) => {
    const perPage = 100;
    const response = await githubAPI.get(`/repos/${owner}/${repository}/pulls`, {
      params: {
        state: "closed",
        sort: "updated",
        direction: "desc",
        per_page: perPage,
      },
    });

    const mergedPRs = response.data.filter((pr: GitHubPR) => pr.merged_at);

    interface formattedPullRequest {
      title: string;
      author: string;
      number: number;
      createdAt: string;
      mergedAt: string;
      durationInHours: number;
      state: string;
      url: string;
    }

    const mergedWithDurations: formattedPullRequest[] = mergedPRs.map((pr: GitHubPR) => {
      const created = new Date(pr.created_at);
      const merged = new Date(pr.merged_at);
      const durationInHours = (merged.getTime() - created.getTime()) / (1000 * 60 * 60);
      return {
        title: pr.title,
        number: pr.number,
        author: pr.user.login,
        createdAt: pr.created_at,
        mergedAt: pr.merged_at,
        durationInHours: parseFloat(durationInHours.toFixed(2)),
        state: pr.state,
        url: pr.html_url,
      };
    });

    const totalDuration = mergedWithDurations.reduce(
      (sum: number, pr: formattedPullRequest) => sum + pr.durationInHours,
      0
    );

    const averageDuration =
      mergedWithDurations.length > 0
        ? parseFloat((totalDuration / mergedWithDurations.length).toFixed(2))
        : null;

    return {
      mergedPullRequests: mergedWithDurations,
      averageTimeToMergeHours: averageDuration,
    };
  };

  public static readonly getHeatMapData = async ({
    owner,
    repository,
    includeAllBranches = false,
  }) => {
    const since = new Date();
    since.setDate(since.getDate() - 240);
    const isoSince = since.toISOString();

    const contributionsByDay: Record<string, number> = {};
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

  public static readonly getReadmeFileName = async (
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

  public static readonly getProjectType = async (
    owner: string,
    repository: string
  ): Promise<{ type: string; dependencyFile: string }> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contents`);

    const files = response.data.map((file: { name: string }) => file.name.toLowerCase());

    const dependencyFiles: Record<string, string | null> = locateDependencyFile(files);

    for (const [type, file] of Object.entries(dependencyFiles)) {
      if (file && files.includes(file.toLowerCase())) {
        return { type, dependencyFile: file };
      }
    }

    return { type: "unknown", dependencyFile: null };
  };

  public static readonly getPunchCard = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/stats/punch_card`);
    return response.data;
  };

  public static readonly getContributors = async (
    owner: string,
    repository: string
  ): Promise<GithubUser[]> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/contributors`);
    return response.data;
  };

  public static readonly download = async ({ owner, repository, branch }, res: Response) => {
    const url = `https://github.com/${owner}/${repository}/archive/refs/heads/${branch}.zip`;

    let response: AxiosResponse<NodeJS.ReadableStream>;
    try {
      response = await axios.get(url, { responseType: "stream" });
    } catch (error) {
      res.status(502).json({ message: `Failed to download archive from GitHub: ${error.message}` });
      return;
    }

    res.setHeader("Content-Disposition", `attachment; filename=${repository}-${branch}.zip`);
    res.setHeader("Content-Type", "application/zip");

    response.data.pipe(res);
  };

  public static readonly getReleases = async (
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

  public static readonly getViews = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/views`);
    return response.data;
  };

  public static readonly getClonesData = async (owner: string, repository: string) => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/traffic/clones`);
    return response.data;
  };

  public static readonly getDetails = async (
    owner: string,
    repository: string
  ): Promise<GithubRepositoryDetails> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}`);
    return response.data;
  };

  public static readonly getLanguages = async (
    owner: string,
    repository: string
  ): Promise<Record<string, number>> => {
    const response = await githubAPI.get(`/repos/${owner}/${repository}/languages`);
    return response.data;
  };

  public static readonly getCommits = async (payload: getCommitsPayload) => {
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

  public static readonly getFile = async ({
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
      return response.data?.content ? base64ToMarkdown(response.data.content) : null;
    } catch (error) {
      return null;
    }
  };
}
