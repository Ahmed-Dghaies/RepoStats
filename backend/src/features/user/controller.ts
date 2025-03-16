import { Request, Response, NextFunction, RequestHandler } from "express";
import { GithubUser } from "./types";
import { UserServices } from "./services";

export class UserController {
  public static getUserDetails: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ error: "Missing required parameters: 'username'" });
        return;
      }

      const userDetails: GithubUser = await UserServices.getDetails(username);
      res.json({ success: true, data: userDetails });
    } catch (error) {
      next(error);
    }
  };

  public static getUserLastCommit: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, repository } = req.params;

      if (!username || !repository) {
        res.status(400).json({
          success: false,
          message: "Missing required parameters: 'username' and 'repository' are required.",
        });
        return;
      }

      const lastCommit = await UserServices.getLastCommit(username, repository);
      res.json({ success: true, data: lastCommit });
    } catch (error) {
      next(error);
    }
  };
}
