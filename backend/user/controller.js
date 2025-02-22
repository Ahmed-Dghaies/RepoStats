import { getUserStats } from "./services.js";
import { validateUsername } from "./validator.js";

const getUserStatsController = async (req, res) => {
  try {
    const username = req.params.username;

    const validationError = validateUsername(username);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const stats = await getUserStats(username);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user stats" });
  }
};

export { getUserStatsController };
