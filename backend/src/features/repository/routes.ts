import express from "express";
import { RepositoryController } from "./controller";

const router = express.Router();

router.get("/:owner/:repository/details", RepositoryController.getDetails);
router.get("/:owner/:repository/punch-card", RepositoryController.getPunchCard);
router.get("/:owner/:repository/commits", RepositoryController.getCommits);
router.get("/:owner/:repository/traffic/clones", RepositoryController.getClones);
router.get("/:owner/:repository/traffic/views", RepositoryController.getViews);
router.get("/:owner/:repository/:branch/download", RepositoryController.download);
router.get("/:owner/:repository/contributors", RepositoryController.getContributors);
router.get("/:owner/:repository/:branch/source-tree", RepositoryController.getSourceTree);
router.get("/:owner/:repository/has-dependencies-file", RepositoryController.checkDependenciesFile);
router.get("/:owner/:repository/file/*", RepositoryController.getFileContent);
router.get("/:owner/:repository/languages", RepositoryController.getRepositoryLanguages);
router.get("/:owner/:repository/heat-map", RepositoryController.getHeatMapData);
router.get("/:owner/:repository/merged-pull-requests", RepositoryController.getMergedPullRequests);

export default router;
