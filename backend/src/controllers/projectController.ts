import * as express from 'express';
import mongoose from "mongoose";

import Page from "../models/Page.ts";
import Project from "../models/Project.ts";
import {
  createProjectWithPage,
  duplicateProjectWithPages,
  updatePagesBulk,
  updateProjectAndPage
} from '../services/projectService.ts';

type Request = express.Request;
type Response = express.Response;

/**
 * Creates a new project with a default first page.
 * @route POST /projects
 * @body {title: string, slug: string, cover?: string, groupId?: string}
 * @returns {project, page} on success (201)
 * 
 * Example request body:
 * {
 *   "title": "My New Project",
 *   "slug": "my-new-project",
 *   "cover": "https://example.com/cover.jpg",
 *   "groupId": "60d5ec7f9d23a8001c8b4567"
 * }
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = "69c9a51d260548585aa1fad8";
    const { title, slug, cover, groupId } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const result = await createProjectWithPage(
      { title, slug, cover, userId, groupId },
    );

    return res.status(201).json(result);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('E11000')) {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    if (error.message.includes('ValidationError')) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Returns all projects belonging to a specific user.
 * @route GET /projects?userId=123
 * @queryparam userId - The user's ObjectId (required)
 * @returns Array of projects sorted by updatedAt (most recent first)
 * 
 * Example response:
 * [
 *   {
 *     "_id": "60d5ec7f9d23a8001c8b4567",
 *     "title": "My Project",
 *     "slug": "my-project",
 *     "cover": "https://...",
 *     "userId": "69c9a51d260548585aa1fad8",
 *     "groupId": null,
 *     "deletedAt": null,
 *     "createdAt": "2024-01-01T00:00:00.000Z",
 *     "updatedAt": "2024-01-02T00:00:00.000Z"
 *   }
 * ]
 */
export const getProjectsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    const userObjectId = new mongoose.Types.ObjectId(userId as string);
    
    const projects = await Project.find({ userId: userObjectId, deletedAt: null })
      .sort({ updatedAt: -1 });
    
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all projects belonging to a specific group.
 * @route GET /projects/group/:groupId
 * @param groupId - The group's ObjectId (path parameter)
 * @returns Array of projects with firstPageId sorted by updatedAt (most recent first)
 * 
 * Example request: GET /projects/group/60d5ec7f9d23a8001c8b4567
 */
export const getProjectsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const groupObjectId = new mongoose.Types.ObjectId(groupId as string);
    
    const projects = await Project.aggregate([
      { $match: { groupId: groupObjectId, deletedAt: null } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: 'pages',
          localField: '_id',
          foreignField: 'projectId',
          as: 'firstPage',
          pipeline: [
            { $match: { deletedAt: null } },
            { $sort: { order: 1 } },
            { $limit: 1 },
            { $project: { _id: 1 } }
          ]
        }
      },
      { $addFields: { firstPageId: { $arrayElemAt: ['$firstPage._id', 0] } } },
      { $project: { firstPage: 0 } }
    ]);
    
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all projects that have no group assigned for a specific user.
 * @route GET /projects/ungrouped?userId=123
 * @queryparam userId - The user's ObjectId (required)
 * @returns Array of projects with firstPageId sorted by updatedAt (most recent first)
 * 
 * Example request: GET /projects/ungrouped?userId=69c9a51d260548585aa1fad8
 */
export const getUngroupedProjectsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    const projects = await Project.aggregate([
      {
        $match: {
          userId: userObjectId,
          deletedAt: null,
          $or: [
            { groupId: null },
            { groupId: { $exists: false } }
          ]
        }
      },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: 'pages',
          localField: '_id',
          foreignField: 'projectId',
          as: 'firstPage',
          pipeline: [
            { $match: { deletedAt: null } },
            { $sort: { order: 1 } },
            { $limit: 1 },
            { $project: { _id: 1 } }
          ]
        }
      },
      { $addFields: { firstPageId: { $arrayElemAt: ['$firstPage._id', 0] } } },
      { $project: { firstPage: 0 } }
    ]);
    
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns a single project by ID along with its first page (lowest order).
 * @route GET /projects/:id
 * @param id - The project's ObjectId (path parameter)
 * @returns { project, firstPage } object
 * 
 * Example response:
 * {
 *   "project": { ... },
 *   "firstPage": {
 *     "_id": "60d5ec7f9d23a8001c8b4568",
 *     "title": "Página Klyro",
 *     "slug": "page-1234567890",
 *     "order": 1,
 *     "puckData": { ... },
 *     "projectId": "60d5ec7f9d23a8001c8b4567"
 *   }
 * }
 */
export const getProject = async (req: Request, res: Response) => {
  try {
    const [project, firstPage] = await Promise.all([
      Project.findById(req.params.id),
      Page.findOne({ projectId: req.params.id }).sort({ order: 1 }).limit(1)
    ]);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ project, firstPage });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Updates the project and current page.
 * @route PATCH /projects/:projectId/:pageId
 * @param projectId - The project's ObjectId (path parameter)
 * @param pageId - The page's ObjectId (path parameter)
 * @body { project?: {title, slug, cover}, page?: {title, slug, puckData} }
 * @returns { project, page? } object
 * 
 * Example request body (update only project):
 * {
 *   "project": {
 *     "title": "Updated Title",
 *     "slug": "updated-slug",
 *     "cover": "https://new-cover.jpg"
 *   }
 * }
 * 
 * Example request body (update only page):
 * {
 *   "page": {
 *     "puckData": { "components": [...] }
 *   }
 * }
 * 
 * Example request body (update both):
 * {
 *   "project": {
 *     "title": "Updated Title"
 *   },
 *   "page": {
 *     "puckData": { "components": [...] }
 *   }
 * }
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const pageId = Array.isArray(req.params.pageId) ? req.params.pageId[0] : req.params.pageId;
    
    // Frontend sends only the fields it wants to update
    const { project: projectData, page: pageData } = req.body;

    const result = await updateProjectAndPage(
      projectId,
      projectData && Object.keys(projectData).length > 0 ? projectData : undefined,
      pageId,
      pageData && Object.keys(pageData).length > 0 ? pageData : undefined
    );

    return res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('Project not found')) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Assigns or removes the group of a project.
 * @route PATCH /projects/:id/group
 * @param id - The project's ObjectId (path parameter)
 * @body { groupId: string | null }
 * @returns Updated project
 * 
 * Example request to assign group:
 * { "groupId": "60d5ec7f9d23a8001c8b4567" }
 * 
 * Example request to remove group:
 * { "groupId": null }
 */
export const updateProjectGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.body;
    // Normalize: empty string or falsy (except explicit null) becomes null
    const normalizedGroupId = groupId && groupId !== '' ? groupId : null;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { groupId: normalizedGroupId },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Moves a project and all its pages to the trash (soft delete).
 * @route PATCH /projects/:id/trash
 * @param id - The project's ObjectId (path parameter)
 * @returns Updated project with deletedAt set
 * 
 * To restore, use PATCH /projects/:id/restore
 */
export const trashProject = async (req: Request, res: Response) => {
  try {
    const deletedAt = new Date();

    const [project] = await Promise.all([
      Project.findByIdAndUpdate(
        req.params.id,
        { deletedAt },
        { new: true }
      ),
      Page.updateMany(
        { projectId: req.params.id },
        { deletedAt }
      )
    ]);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(project);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Restores a trashed project and all its pages.
 * @route PATCH /projects/:id/restore
 * @param id - The project's ObjectId (path parameter)
 * @returns Updated project with deletedAt cleared
 */
export const restoreProject = async (req: Request, res: Response) => {
  try {
    const [project] = await Promise.all([
      Project.findByIdAndUpdate(
        req.params.id,
        { deletedAt: null },
        { new: true }
      ),
      Page.updateMany(
        { projectId: req.params.id },
        { deletedAt: null }
      )
    ]);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(project);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all trashed projects for a user.
 * @route GET /projects/trash?userId=123
 * @queryparam userId - The user's ObjectId (required)
 * @returns Array of projects with deletedAt != null
 * 
 * Example request: GET /projects/trash?userId=69c9a51d260548585aa1fad8
 */
export const getTrashedProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    const projects = await Project.find({
      userId: userObjectId,
      deletedAt: { $ne: null }
    })
      .select('_id title cover deletedAt updatedAt createdAt userId groupId')
      .sort({ deletedAt: -1 });

    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Duplicates a project and all its pages.
 * @route POST /projects/:id/duplicate
 * @param id - The source project's ObjectId (path parameter)
 * @returns New duplicated project
 * 
 * Example request: POST /projects/60d5ec7f9d23a8001c8b4567/duplicate
 * 
 * The duplicated project will have:
 * - title: "Original Title (copy)"
 * - slug: "original-slug-copy-1234567890"
 * - same cover, userId, groupId
 * - first page duplicated, remaining pages also copied
 */
export const duplicateProject = async (req: Request, res: Response) => {
  try {
     const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const newProject = await duplicateProjectWithPages(projectId);

    if (!newProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(201).json(newProject);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Deletes a project by ID and all pages linked.
 * @route DELETE /projects/:id
 * @param id - The project's ObjectId (path parameter)
 * @returns 204 No Content on success
 * 
 * This is a permanent deletion (hard delete).
 */
export const deleteProjectAndPages = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await Page.deleteMany({ projectId: req.params.id });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Updates multiple pages at once (e.g., for reordering).
 * @route PATCH /projects/:projectId/pages/bulk
 * @param projectId - The project's ObjectId (path parameter)
 * @body { pages: Array<{ _id: string, order?: number, title?: string, slug?: string, puckData?: object }> }
 * @returns Array of updated pages
 * 
 * Example request body:
 * {
 *   "pages": [
 *     { "_id": "page1", "order": 1 },
 *     { "_id": "page2", "order": 2 },
 *     { "_id": "page3", "order": 3 }
 *   ]
 * }
 */
export const updatePagesBulkController = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const { pages } = req.body;

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: 'pages array is required' });
    }

    const updatedPages = await updatePagesBulk(projectId, pages);

    return res.status(200).json(updatedPages);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('Project not found')) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.status(500).json({ error: error.message });
  }
};
