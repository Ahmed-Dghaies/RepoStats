import { githubAPI } from "../config/githubService";

const getUserStats = async (username) => {
  try {
    const response = await githubAPI.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user stats from GitHub");
  }
};

export { getUserStats };
