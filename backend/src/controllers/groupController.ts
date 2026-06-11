import * as express from 'express';
import mongoose from 'mongoose';

import Group from '../models/Group.ts';
import Page from '../models/Page.ts';
import Project from '../models/Project.ts';

type Request = express.Request;
type Response = express.Response;

/**
 * Creates a new project group in the database.
 * 
 * @route POST /groups
 * @body {name: string, userId: string} req.body - Object containing the group name and user ID
 * @returns {Promise<Response>} 201 with the created group document, or 500 on error.
 */
export const createGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.create(req.body);
    return res.status(201).json(group);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Fetches and returns all groups belonging to a specific user.
 * 
 * @route GET /groups?userId=123
 * @query {string} userId - Owner user ID (required)
 * @returns {Promise<Response>} 200 with the list of groups, or 500 on error.
 */
export const getGroupsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    const userObjectId = new mongoose.Types.ObjectId(userId as string);
    const groups = await Group.find({ userId: userObjectId });
    return res.json(groups);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Fetches the details of a specific group by its ID.
 * 
 * @route GET /groups/:id
 * @param {string} id - Unique group ID in the database
 * @returns {Promise<Response>} 200 with the group document, 404 if not found, or 500 on error.
 */
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    return res.json(group);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Returns all user groups along with their associated active projects.
 * 
 * This method includes a built-in self-healing mechanism that checks
 * for orphaned projects in the database (active projects pointing to
 * groups that no longer exist). If found, the system automatically
 * moves them to the trash (soft-delete) and removes the group association.
 * 
 * @route GET /groups/with-projects?userId=123
 * @query {string} userId - Owner user ID (required)
 * @returns {Promise<Response>} 200 with aggregated groups and projects, or 500 on error.
 */
export const getGroupsWithProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    // Step 1: Search parameter validation
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required and must be a string' });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // console.log('[getGroupsWithProjects] userId:', userId);
    
    // Step 2: Database self-healing module
    // 2.1. Fetch all active user group IDs
    const activeGroups = await Group.find({ userId: userObjectId }, '_id');
    const activeGroupIds = activeGroups.map(g => g._id);
    const activeGroupStrings = activeGroupIds.map(id => id.toString());
    // console.log('[getGroupsWithProjects] activeGroupIds:', activeGroupIds);
    // console.log('[getGroupsWithProjects] activeGroupStrings:', activeGroupStrings);
    
    // 2.2. Search for active projects (deletedAt: null) that have a groupId,
    // but whose ID is not present in the active groups list (ObjectId or String)
    const orphanedProjects = await Project.find({
      userId: userObjectId,
      deletedAt: null,
      $and: [
        { groupId: { $ne: null } },
        { groupId: { $nin: activeGroupIds } },
        { groupId: { $nin: activeGroupStrings } }
      ]
    });
    // console.log('[getGroupsWithProjects] orphanedProjects found:', orphanedProjects.length);
    
    // 2.3. If orphaned projects are found, repair them by moving them to trash
    if (orphanedProjects.length > 0) {
      const deletedAt = new Date();
      const orphanedIds = orphanedProjects.map(p => p._id);
      console.log('[getGroupsWithProjects] Trashing orphaned projects:', orphanedIds);
      
      // Move orphaned projects to trash (set deletedAt and remove groupId)
      const pRes = await Project.updateMany(
        { _id: { $in: orphanedIds } },
        { deletedAt, groupId: null }
      );
      console.log('[getGroupsWithProjects] Projects update result:', pRes);
      
      // Move all related pages of those projects to trash
      const pgRes = await Page.updateMany(
        { projectId: { $in: orphanedIds } },
        { deletedAt }
      );
      console.log('[getGroupsWithProjects] Pages update result:', pgRes);
    }
    
    // Step 3: Preventive validation for existing groups
    const groups = await Group.find({ userId: userObjectId });
    
    // If the user has no active groups, return an empty array immediately
    if (groups.length === 0) {
      return res.json([]);
    }
    
    // Step 4: MongoDB aggregation (Lookup)
    // Joins groups and projects collections in a single optimized query
    const data = await Group.aggregate([
      // 4.1. Filter only groups belonging to the current user
      {
        $match: {
          userId: userObjectId
        }
      },
      // 4.2. Perform the collection join ($lookup) with projects
      {
        $lookup: {
          from: 'projects',
          let: { groupId: '$_id' },
          pipeline: [
            {
              // Filter projects belonging to this group and NOT in trash
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$groupId', '$$groupId'] },
                    { $eq: ['$deletedAt', null] }
                  ]
                }
              }
            },
            // Select only necessary fields in the response (traffic optimization)
            {
              $project: {
                title: 1,
                cover: 1,
                slug: 1,
                version: 1,
                updatedAt: 1
              }
            },
            // Sort group projects from most recent to oldest
            {
              $sort: { updatedAt: -1 }
            }
          ],
          as: 'projects'
        }
      },
      // 4.3. Sort groups by creation date
      {
        $sort: { createdAt: -1 }
      },
      // 4.4. Limit results to a maximum of 50 groups for performance
      {
        $limit: 50
      }
    ]);
 
    return res.json(data);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Updates the name or other properties of an existing group.
 * 
 * @route PATCH /groups/:id
 * @param {string} id - ID of the group to update
 * @body {Partial<{name: string}>} req.body - Updated group properties
 * @returns {Promise<Response>} 200 with the updated group, 404 if not found, or 500 on error.
 */
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    return res.json(group);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Permanently deletes a group and moves all related projects and pages to trash (soft-delete).
 * 
 * Supports polymorphic BSON matching to find group relationships
 * stored both as native ObjectId and plain String, mitigating
 * type conflicts and ensuring deletion consistency.
 * 
 * @route DELETE /groups/:id
 * @param {string} id - Unique ID of the group to remove (route parameter)
 * @returns {Promise<Response>} 200 on success, 404 if the group does not exist, or 500 on error.
 */
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const groupId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // console.log('[deleteGroup] Request params groupId:', groupId);

    // Step 1: Convert group ID to native Mongoose ObjectId format
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    // console.log('[deleteGroup] Converted to ObjectId:', groupObjectId);
    
    // Step 2: Polymorphic search for projects belonging to this group.
    // Search using both BSON ObjectId and BSON String to avoid typing issues.
    const projects = await Project.find({
      $or: [
        { groupId: groupObjectId }, // Native database type
        { groupId: groupId }        // Plain string type
      ]
    });
    // console.log('[deleteGroup] Projects found in this group:', projects.length);
    // console.log('[deleteGroup] Projects:', projects.map(p => ({ id: p._id, title: p.title, groupId: p.groupId })));
    
    // Step 3: Soft-delete all associated projects (if any)
    if (projects.length > 0) {
      const deletedAt = new Date();
      const projectIds = projects.map(p => p._id);
      
      // 3.1. Mark projects as deleted (deletedAt) and remove the group relationship (groupId: null)
      // so they appear individually in the trash.
      await Project.updateMany(
        { _id: { $in: projectIds } },
        { deletedAt, groupId: null }
      );
      // console.log('[deleteGroup] Project soft-delete result:', pRes);
      
      // 3.2. Mark all pages belonging to those projects as deleted.
      await Page.updateMany(
        { projectId: { $in: projectIds } },
        { deletedAt }
      );
      // console.log('[deleteGroup] Page soft-delete result:', pgRes);
    }
    
    // Step 4: Hard-delete (permanent removal) of the group
    // console.log('[deleteGroup] Deleting group with ID:', groupObjectId);
    const group = await Group.findByIdAndDelete(groupObjectId);
    // console.log('[deleteGroup] Deleted group document:', group);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
