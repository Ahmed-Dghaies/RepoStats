import express from "express";
import { UserController } from "./controller";

const router = express.Router();

router.get("/:username/details", UserController.getUserDetails);
router.get("/:owner/:repository/last-commit", UserController.getUserLastCommit);

export default router;
