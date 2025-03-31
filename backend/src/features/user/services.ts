import { githubAPI } from "../../config/githubService";

export class UserServices {
  public static getDetails = async (username: string) => {
    const response = await githubAPI.get(`/users/${username}`);
    return response.data;
  };

  public static getLastCommit = async ({ owner, repository, author }) => {
    const authorFilter = author ? `?author=${author}` : "";
    const response = await githubAPI.get(`/repos/${owner}/${repository}/commits${authorFilter}`);
    if (response.data.length === 0) {
      return null;
    }
    return response.data[0];
  };
}
