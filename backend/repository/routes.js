import express from "express";
import { getRepositoryStatsController } from "./controller.js";

const router = express.Router();

router.get("/:username/:repoName/stats", getRepositoryStatsController);

export default router;
