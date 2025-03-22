import { Request, Response, NextFunction, RequestHandler } from "express";
import { RepositoryServices } from "./services";
import { UserServices } from "../user/services";
import { formatRepositorySize } from "./utils";

interface GitHubTreeItem {
  path: string;
  type: "tree" | "blob";
}

interface TreeNode {
  name: string;
  type: "directory" | "file";
  children?: TreeNode[];
}

export class RepositoryController {
  public static getContributors: RequestHandler = async (
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

  public static download: RequestHandler = async (
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

  public static getSourceTree = async (
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
      }

      if (!branch) {
        const repositoryDetails = await RepositoryServices.getDetails(owner, repository);
        branch = repositoryDetails.default_branch;
      }

      const sourceTree = await RepositoryServices.getSourceTree({ owner, repository, branch });
      const { tree }: { tree: GitHubTreeItem[] } = sourceTree;
      const root: TreeNode = { name: repository, type: "directory", children: [] };
      tree.forEach((item) => {
        const parts = item.path.split("/");
        let current = root;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const isLast = i === parts.length - 1;
          let existing = current.children?.find((child) => child.name === part);
          if (!existing) {
            existing = {
              name: part,
              type: isLast && item.type === "blob" ? "file" : "directory",
              children: [],
            };
            current.children?.push(existing);
          }

          if (!isLast) {
            current = existing;
          }
        }
      });
      res.json(root);
    } catch (err) {
      next(err);
    }
  };

  public static getViews: RequestHandler = async (
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

  public static getDetails: RequestHandler = async (
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

      const details = await RepositoryServices.getDetails(owner, repository);
      const releases = await RepositoryServices.getReleases(owner, repository);
      const languages = await RepositoryServices.getLanguages(owner, repository);

      const result = {
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
        size: formatRepositorySize(details.size),
        languages: languages ?? {},
        openIssues: details.open_issues_count,
        createdAt: new Date(details.created_at).toISOString().split("T")[0],
        updatedAt: details.updated_at,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public static getClones: RequestHandler = async (
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

  public static getCommits: RequestHandler = async (
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

  public static getPunchCard: RequestHandler = async (
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

  public static checkDependenciesFile: RequestHandler = async (
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

  public static getFileContent: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { owner, repository, path } = req.params;
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
