import * as express from 'express';
import mongoose from "mongoose";

import Page from "../models/Page.ts";
import Project from "../models/Project.ts";

type Request = express.Request;
type Response = express.Response;

/**
 * Creates a new page for a project.
 * @route POST /pages
 */
export const createPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, order, puckData, projectId } = req.body;

    if (!projectId || !slug) {
      return res.status(400).json({ error: 'projectId and slug are required' });
    }

    // Verify project exists and is not deleted
    const project = await Project.findById(projectId);
    if (!project || project.deletedAt) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // If order not provided, set as next order
    const pageOrder = order ?? 1;

    const page = await Page.create({
      title: title ?? 'Página Klyro',
      slug,
      order: pageOrder,
      puckData: puckData ?? {},
      projectId,
      deletedAt: null,
    });

    return res.status(201).json(page);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('E11000')) {
      return res.status(409).json({ error: 'Slug already exists for this project' });
    }
    if (error.message.includes('ValidationError')) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Returns all pages for a specific project, sorted by order.
 * @route GET /pages?projectId=123
 * @queryparam projectId - The project's ObjectId
 */
export const getPagesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId query parameter is required' });
    }

    // without puckData to be more lightweight
    const userObjectId = new mongoose.Types.ObjectId(projectId as string);
    const pages = await Page.find({ 
      projectId: userObjectId, 
      deletedAt: null 
    })
      .select('_id title slug order projectId createdAt updatedAt')
      .sort({ order: 1 });

    return res.json(pages);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns a single page by ID.
 * @route GET /pages/:id
 * @param id - The page's ObjectId
 */
export const getPage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.deletedAt) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Updates a page.
 * @route PATCH /pages/:id
 * @param id - The page's ObjectId
 */
export const updatePage = async (req: Request, res: Response) => {
  try {
    const { title, slug, order, puckData } = req.body;
    const allowedUpdates: Record<string, unknown> = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (slug !== undefined) allowedUpdates.slug = slug;
    if (order !== undefined) allowedUpdates.order = order;
    if (puckData !== undefined) allowedUpdates.puckData = puckData;

    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.deletedAt) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Moves a page to trash (soft delete).
 * @route PATCH /pages/:id/trash
 * @param id - The page's ObjectId
 */
export const trashPage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Restores a trashed page.
 * @route PATCH /pages/:id/restore
 * @param id - The page's ObjectId
 */
export const restorePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { deletedAt: null },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Deletes a page permanently.
 * @route DELETE /pages/:id
 * @param id - The page's ObjectId
 */
export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Reorders pages for a project.
 * Expects { pageId: "id", newOrder: number }
 * @route PATCH /pages/reorder
 */
export const reorderPages = async (req: Request, res: Response) => {
  try {
    const { pageId, newOrder } = req.body;

    if (!pageId || newOrder === undefined) {
      return res.status(400).json({ error: 'pageId and newOrder are required' });
    }

    const page = await Page.findById(pageId);
    if (!page || page.deletedAt) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const oldOrder = page.order;
        const { projectId } = page;

        if (oldOrder === newOrder) {
          return;
        }

        if (newOrder < oldOrder) {
          // Moving up: increment orders between newOrder and oldOrder-1
          await Page.updateMany(
            {
              projectId,
              order: { $gte: newOrder, $lt: oldOrder }
            },
            { $inc: { order: 1 } },
            { session }
          );
        } else {
          // Moving down: decrement orders between oldOrder+1 and newOrder
          await Page.updateMany(
            {
              projectId,
              order: { $gt: oldOrder, $lte: newOrder }
            },
            { $inc: { order: -1 } },
            { session }
          );
        }

        page.order = newOrder;
        await page.save({ session });
      });
    } finally {
      session.endSession();
    }

    return res.json(page);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
