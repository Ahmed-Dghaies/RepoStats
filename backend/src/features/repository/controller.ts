import { Request, Response, NextFunction, RequestHandler } from "express";
import { RepositoryServices } from "./services";
import { UserServices } from "../user/services";
import { formatRepositorySize } from "./utils";
import { GithubRepositoryDetails } from "../../types/repository";
import validator from "validator";

export class RepositoryController {
  public static readonly getStaticAnalysis: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      if (!owner || !repository) {
        res.status(400).json({ error: "Owner and repository parameters are required" });
        return;
      }

      if (
        !validator.matches(owner, /^[a-z0-9_-]+$/i) ||
        !validator.matches(repository, /^[a-z0-9_-]+$/i)
      ) {
        res.status(400).json({ error: "Invalid characters in owner/repository name" });
        return;
      }

      if (owner.length > 39 || repository.length > 39) {
        res.status(400).json({ error: "Owner/repository name too long" });
        return;
      }

      const staticAnalysis = await RepositoryServices.getStaticAnalysis({
        owner: validator.escape(owner),
        repository: validator.escape(repository),
      });
      res.json(staticAnalysis);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getContributors: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      const contributorsList = await RepositoryServices.getContributors(owner, repository);

      const resolvedContributors = await Promise.all(
        contributorsList.map(async (user: any) => {
          try {
            const userDataResponse = await UserServices.getDetails(user.login);
            const userData = userDataResponse;

            return {
              login: user.login,
              contributions: user.contributions,
              avatarUrl: user.avatar_url,
              email: userData.email,
            };
          } catch (error) {
            console.error(`Error while retrieving user data for ${user.login}:`, error);
            return {
              login: user.login,
              contributions: user.contributions,
              avatarUrl: user.avatar_url,
            };
          }
        })
      );

      res.json(resolvedContributors);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getHeatMapData: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;
      const heatMapData = await RepositoryServices.getHeatMapData({ owner, repository });
      res.json(heatMapData);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getMergedPullRequests: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;
      const details = await RepositoryServices.getMergedPullRequests({ owner, repository });
      res.json(details);
    } catch (err) {
      next(err);
    }
  };

  public static readonly download: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { owner, repository, branch } = req.params;

      if (!owner || !repository) {
        res.status(400).json({
          success: false,
          message: "Missing required parameters: 'owner' and/or 'repository' are missing",
        });
        return;
      }

      if (!branch) {
        const repositoryDetails = await RepositoryServices.getDetails(owner, repository);
        branch = repositoryDetails.default_branch;
      }

      await RepositoryServices.download({ owner, repository, branch }, res);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getSourceTree = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { owner, repository, branch } = req.params;

      if (!owner || !repository) {
        res.status(400).json({
          success: false,
          message: "Missing required parameters: 'owner' and/or 'repository' are missing",
        });
        return;
      }

      if (!branch) {
        const repositoryDetails = await RepositoryServices.getDetails(owner, repository);
        branch = repositoryDetails.default_branch;
      }

      const sourceTree = await RepositoryServices.getSourceTree({ owner, repository, branch });
      res.json(sourceTree);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getViews: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      const views = await RepositoryServices.getViews(owner, repository);

      res.json(views);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getRepositoryLanguages: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      const languages = await RepositoryServices.getLanguages(owner, repository);

      res.json(languages);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getDetails: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      if (!owner || !repository) {
        res.status(400).json({
          success: false,
          error: "Missing required parameters: 'owner' or 'repository'",
        });
        return;
      }

      // TODO: work on a retry logic in case one of the requests fails
      const responses = await Promise.all([
        RepositoryServices.getDetails(owner, repository),
        RepositoryServices.getReleases(owner, repository),
        RepositoryServices.getLanguages(owner, repository),
        RepositoryServices.getProjectType(owner, repository),
        RepositoryServices.getReadmeFileName(owner, repository),
      ]);

      const [details, releases, languages, projectType, readMeFilename] = responses as [
        GithubRepositoryDetails,
        { latest: { tag_name: string; published_at: string } | null; nbReleases: number },
        Record<string, number>,
        { type: string; dependencyFile: string },
        string | null
      ];

      res.json({
        name: details.name,
        fullName: details.full_name,
        defaultBranch: details.default_branch,
        owner: {
          login: details.owner.login,
          avatarUrl: details.owner.avatar_url,
          contributions: 0,
        },
        stars: details.stargazers_count,
        license: details.license ? details.license.name : null,
        description: details.description,
        releases: {
          latestRelease: releases.latest
            ? {
                tagName: releases.latest.tag_name,
                releaseDate: releases.latest.published_at,
              }
            : null,
          nbReleases: releases.nbReleases,
        },
        forkCount: details.forks_count,
        watchersCount: details.watchers_count,
        size: formatRepositorySize(details.size),
        languages: languages ?? {},
        openIssues: details.open_issues_count,
        createdAt: new Date(details.created_at).toISOString().split("T")[0],
        updatedAt: details.updated_at,
        readme: readMeFilename,
        projectType: projectType.type,
        dependencyFile: projectType.dependencyFile,
      });
    } catch (err) {
      next(err);
    }
  };

  public static readonly getClones: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      const clonesData = await RepositoryServices.getClonesData(owner, repository);

      res.json(clonesData);
    } catch (error) {
      next(error);
    }
  };

  public static readonly getCommits: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;
      const { until, since, commitsPerPage, currentPage } = req.query as {
        until: string;
        since: string;
        commitsPerPage: string;
        currentPage: string;
      };

      if (!owner || !repository) {
        res.status(400).json({
          success: false,
          error: "Missing required parameters: 'owner' or 'repository'",
        });
        return;
      }

      let commits = await RepositoryServices.getCommits({
        owner,
        repository,
        since,
        until,
        commitsPerPage: parseInt(commitsPerPage),
        currentPage: parseInt(currentPage),
      });

      if (commits) {
        commits = commits.map((commit: any) => ({
          id: commit.sha,
          author: commit.commit.author.name,
          date: commit.commit.author.date,
        }));
      }

      res.json(commits);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getPunchCard: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;

      const response = await RepositoryServices.getPunchCard(owner, repository);
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public static readonly checkDependenciesFile: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;
      const response = await RepositoryServices.getFile({
        owner,
        repository,
        path: "package.json",
      });
      if (response) {
        res.json(true);
        return;
      }
      res.json(false);
    } catch (err) {
      next(err);
    }
  };

  public static readonly getFileContent: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository } = req.params;
      const path = req.params[0];
      const response = await RepositoryServices.getFile({
        owner,
        repository,
        path,
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}
