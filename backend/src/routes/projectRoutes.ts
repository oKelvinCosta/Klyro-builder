import express from "express";

import {
    createProject,
    deleteProjectAndPages,
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
} from "../controllers/projectController.ts";

const router = express.Router();

// the order of routes matters
// more specific routes should be defined before general ones
router.post("/", createProject);
router.post("/:id/duplicate", duplicateProject);
router.get("/", getProjectsByUser);
router.get("/ungrouped", getUngroupedProjectsByUser);
router.get("/trash", getTrashedProjects);
router.get("/group/:groupId", getProjectsByGroup);
router.get("/:id", getProject);
router.patch("/:id/group", updateProjectGroup);
router.patch("/:projectId/:pageId", updateProject);
router.patch("/:projectId/pages/bulk", updatePagesBulkController);
router.patch("/:id/trash", trashProject);
router.patch("/:id/restore", restoreProject);
router.delete("/:id", deleteProjectAndPages);

export default router;
