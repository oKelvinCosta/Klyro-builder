import * as express from 'express';
import mongoose from "mongoose";

import Group from "../models/Group.ts";

type Request = express.Request;
type Response = express.Response;

export const createGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.create(req.body);
    return res.status(201).json(group);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

// GET /groups?userId=123
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

// GET /groups/abc123
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

// GET /groups-with-getGroupsWithProjects?userId=123
export const getGroupsWithProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required and must be a string' });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    
    // Primeiro, testa apenas o match
    const groups = await Group.find({ userId: userObjectId });
    // console.log('groups found:', groups.length);
    
    // Se não houver grupos, retorna vazio
    if (groups.length === 0) {
      return res.json([]);
    }
    
    const data = await Group.aggregate([
      {
        $match: {
          userId: userObjectId
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { groupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$groupId', '$$groupId'] },
                    { $eq: ['$deletedAt', null] }
                  ]
                }
              }
            },
            {
              $project: {
                title: 1,
                cover: 1,
                slug: 1,
                version: 1,
                updatedAt: 1
              }
            },
            {
              $sort: { updatedAt: -1 }
            }
          ],
          as: 'projects'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 50
      }
    ]);
 
    return res.json(data);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

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

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    return res.json({ success: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
