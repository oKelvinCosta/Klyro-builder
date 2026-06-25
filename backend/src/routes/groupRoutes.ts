import express from "express";

import { verifyFirebaseToken } from "#/middlewares/verifyFirebaseToken.js";
import {
    createGroup,
    deleteGroup,
    getGroupById,
    getGroupsByUserId,
    getGroupsWithProjects,
    updateGroup
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createGroup);
router.get("/", verifyFirebaseToken, getGroupsByUserId);
router.get("/with-projects", verifyFirebaseToken, getGroupsWithProjects);
router.get("/:id", getGroupById);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;