import express from "express";
import { getUserStatsController } from "./controller.js";

const router = express.Router();

router.get("/:username/stats", getUserStatsController);

export default router;
