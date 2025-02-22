import { getRepositoryStats } from "./services.js";
import { validateRepoName } from "./validator.js";

const getRepositoryStatsController = async (req, res) => {
  try {
    const { username, repoName } = req.params;

    const validationError = validateRepoName(repoName);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const stats = await getRepositoryStats(username, repoName);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ error: "Error fetching repository stats" });
  }
};

export { getRepositoryStatsController };
