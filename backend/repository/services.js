import { githubAPI } from "../config/githubService";

const getRepositoryStats = async (username, repoName) => {
  try {
    const response = await githubAPI.get(`/repos/${username}/${repoName}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching repository stats from GitHub");
  }
};

export { getRepositoryStats };
