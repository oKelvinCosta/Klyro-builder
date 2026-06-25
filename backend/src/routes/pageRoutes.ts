import express from "express";
import * as pageController from "../controllers/pageController.js";

const router = express.Router();

// Create a new page
router.post("/", pageController.createPage);

// Get all pages for a project
router.get("/", pageController.getPagesByProject);

// Get a single page
router.get("/:id", pageController.getPage);

// Update a page
router.patch("/:id", pageController.updatePage);

// Trash a page
router.patch("/:id/trash", pageController.trashPage);

// Restore a trashed page
router.patch("/:id/restore", pageController.restorePage);

// Delete a page permanently
router.delete("/:id", pageController.deletePage);

// Reorder pages
router.patch("/reorder", pageController.reorderPages);

export default router;
