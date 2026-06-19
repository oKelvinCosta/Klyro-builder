import User from "@/models/User.ts";
import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { auth } from "../services/firebaseAdminService.ts";

export interface AuthenticatedRequest extends Request {
  firebaseUser?: {
    uid: string;
    email?: string;
    [key: string]: any;
  };
  userId?: Types.ObjectId | null;
}

export async function verifyFirebaseToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);

    // When register a new user it will return null
    const user = await User.findOne({ firebaseUid: decoded.uid });

    req.firebaseUser = decoded;
    req.userId = user?._id || null;
    next();
  } catch (error) {
    console.error("Erro ao verificar token Firebase:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}