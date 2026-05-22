import express from "express";

import {
    createGroup,
    deleteGroup,
    getGroupById,
    getGroupsByUserId,
    getGroupsWithPages,
    updateGroup
} from "../controllers/groupController.ts";

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroupsByUserId);
router.get("/with-pages", getGroupsWithPages);
router.get("/:id", getGroupById);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;