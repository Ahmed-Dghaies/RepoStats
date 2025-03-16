import express from "express";
import { UserController } from "./controller.js";

const router = express.Router();

router.get("/:username/details", UserController.getUserDetails);
router.get("/:username/:repository/last-commit", UserController.getUserLastCommit);

export default router;
