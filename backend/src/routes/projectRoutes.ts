import express from "express";

import { verifyFirebaseToken } from "#/middlewares/verifyFirebaseToken.js";
import {
    createProject,
    duplicateProject,
    getProject,
    getProjectsByGroup,
    getProjectsByUser,
    getTrashedProjects,
    getUngroupedProjectsByUser,
    restoreProject,
    trashProject,
    updatePagesBulkController,
    updateProject,
    updateProjectGroup
} from "../controllers/projectController.js";

const router = express.Router();

// the order of routes matters
// more specific routes should be defined before general ones
router.post("/", verifyFirebaseToken, createProject);
router.post("/:id/duplicate", duplicateProject);
router.get("/", getProjectsByUser);
router.get("/ungrouped", verifyFirebaseToken, getUngroupedProjectsByUser);
router.get("/trash",verifyFirebaseToken, getTrashedProjects);
router.get("/group/:groupId", getProjectsByGroup);
router.get("/:id", getProject);
router.patch("/:id/group", updateProjectGroup);
router.patch("/:id/trash", trashProject);
router.patch("/:id/restore", restoreProject);
router.patch("/:projectId/pages/bulk", updatePagesBulkController);
router.patch("/:projectId/:pageId", updateProject);

export default router;
