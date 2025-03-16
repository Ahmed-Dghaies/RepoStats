import { githubAPI } from "../../config/githubService";

export class UserServices {
  public static getDetails = async (username: string) => {
    try {
      const response = await githubAPI.get(`/users/${username}`);
      return await response.data;
    } catch (error) {
      console.error(`[ERROR] Fetching user data failed: ${error.message}`);
      throw error;
    }
  };

  public static getLastCommit = async ({ owner, repository, author }) => {
    try {
      const authorFilter = author ? `?author=${author}` : "";
      const response = await githubAPI.get(`/repos/${owner}/${repository}/commits${authorFilter}`);
      const commits = await response.data;
      if (commits.length === 0) {
        return null;
      }
      return commits[0];
    } catch (error) {
      throw {
        error: {
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500,
        },
      };
    }
  };
}
