import * as express from 'express';
import mongoose from "mongoose";

import Page from "../models/Page.ts";
import Project from "../models/Project.ts";
import {
  createProjectWithPage,
  duplicateProjectWithPages,
  updateProjectAndPage
} from '../services/projectService.ts';

type Request = express.Request;
type Response = express.Response;

/**
 * Creates a new project with a default first page.
 * @route POST /projects
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
 * @queryparam userId - The user's ObjectId
 */
export const getProjectsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    const userObjectId = new mongoose.Types.ObjectId(userId as string);
    // Only the essential fields for listing
    const Projects = await Project.find({ userId: userObjectId, deletedAt: null }).select('_id title cover updatedAt createdAt userId groupId');
    return res.json(Projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all projects belonging to a specific group, sorted by most recently updated.
 * @route GET /projects/group/:groupId
 * @param groupId - The group's ObjectId
 */
export const getProjectsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const groupObjectId = new mongoose.Types.ObjectId(groupId as string);
    const Projects = await Project.find({ groupId: groupObjectId, deletedAt: null })
      .select('_id title cover updatedAt createdAt userId groupId')
      .sort({ updatedAt: -1 });
    return res.json(Projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all projects that have no group assigned for a specific user.
 * @route GET /projects/ungrouped?userId=123
 * @queryparam userId - The user's ObjectId
 */
export const getUngroupedProjectsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    // Find Projects where groupId is null, undefined, or doesn't exist
    const Projects = await Project.find({ 
      userId: userObjectId,
      deletedAt: null,
      $or: [
        { groupId: null },
        { groupId: { $exists: false } }
      ]
    })
    .select('_id title cover updatedAt createdAt userId groupId')
    .sort({ updatedAt: -1 });
    
    return res.json(Projects);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns a single project by ID along with its first page (lowest order).
 * To load all pages, remove .limit(1) or use a dedicated /projects/:id/pages endpoint.
 * @route GET /projects/:id
 * @param id - The project's ObjectId
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
 * Not is necessary pass info of a page, but the current pageId is
 * @route PUT /projects/:projectId/:pageId
 * @param projectId - The project's ObjectId
 * @param pageId - The page's ObjectId
 * {
  "project": {
    "title": "Novo título",
    "slug": "novo-slug",
    "cover": "nova-url"
  },
  "page": {
    "puckData": {...},
    "title": "Título da página"
  }
}

 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const pageId = Array.isArray(req.params.pageId) ? req.params.pageId[0] : req.params.pageId;
    
    // Frontend sends only the fields it wants to update
    const { project: projectData, page: pageData } = req.body;

    const result = await updateProjectAndPage(
      projectId,
      projectData,
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
 * Send at body { groupId: "<id>" } to assign, or { groupId: null } to remove.
 * @route PATCH /projects/:id/group
 * @param id - The project's ObjectId
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
 * Restore by clearing deletedAt. Permanently delete with deleteProject.
 * @route PATCH /projects/:id/trash
 * @param id - The project's ObjectId
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
 * @param id - The project's ObjectId
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
 * @queryparam userId - The user's ObjectId
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
 * @param id - The source project's ObjectId
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
 * @param id - The project's ObjectId
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