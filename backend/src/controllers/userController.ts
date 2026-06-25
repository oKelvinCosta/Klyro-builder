import * as express from 'express';
type Response = express.Response;

import type { AuthenticatedRequest } from "../middlewares/verifyFirebaseToken.js";
import User from "../models/User.js";

/**
 * Lista todos os usuários.
 * Protegida por verifyFirebaseToken (qualquer usuário autenticado pode ver,
 * já que designers/revisores precisam ver a equipe).
 * Se quiser restringir só a admins, veja a nota no final do arquivo.
 */
export const getUsers = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * Atualiza um usuário.
 * Regra de negócio: só o próprio usuário (firebaseUid bate com o token)
 * ou um admin pode atualizar.
 */
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requesterUid = req.firebaseUser?.uid;
    const requester = await User.findOne({ firebaseUid: requesterUid });

    const isSelf = targetUser.firebaseUid === requesterUid;
    const isAdmin = requester?.role === "admin";

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: 'Sem permissão para editar este usuário' });
    }

    // Usuários comuns não podem alterar a própria role
    if (!isAdmin && req.body.role) {
      delete req.body.role;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    return res.json(user);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

// createUser foi removido: a criação de usuários agora acontece exclusivamente
// via authController.syncUser, que exige um ID token Firebase válido.
// Isso evita criação de usuários "fantasma" sem autenticação real.

// export const deleteUser = async (req: Request, res: Response) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// };