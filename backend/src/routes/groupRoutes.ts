import express from "express";

import {
    createGroup,
    deleteGroup,
    getGroupById,
    getGroupsByUserId,
    getGroupsWithProjects,
    updateGroup
} from "../controllers/groupController.ts";

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroupsByUserId);
router.get("/with-projects", getGroupsWithProjects);
router.get("/:id", getGroupById);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;