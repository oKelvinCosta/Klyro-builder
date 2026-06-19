import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/verifyFirebaseToken";

import { debug } from "@/config/debug.ts";
import { z } from "zod";
import User from "../models/User.ts";

const syncUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nome deve ter pelo menos 1 caractere")
    .max(50, "Nome muito longo")
});


/**
* Creates or updates the user in MongoDB based on the validated Firebase token.
* Called by the frontend after login/registration.
*/

export async function syncUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { uid, email } = req.firebaseUser!;

    // ✅ validação segura do body
    const parsed = syncUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: parsed.error.format(),
      });
    }

    const { name } = parsed.data;

    let user = await User.findOne({ firebaseUid: uid });
    debug("syncUser: Usuário encontrado no DB?:", user);

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email?.split("@")[0],
        role: "user",          // ✅ protegido
        active: true,          // ✅ protegido
        lastLogin: new Date(),
      });

      debug("syncUser: Novo usuário criado:", user);
    } else {
      debug("syncUser: Usuário existente encontrado, atualizando dados.");
      user.lastLogin = new Date();

      // ✅ atualiza nome apenas se válido e vazio anteriormente
      if (name && !user.name) {
        user.name = name;
        debug("syncUser: Nome atualizado:", name);
      }

      await user.save();
      debug("syncUser: Usuário atualizado:", user);
    }

    return res.json({ user });

  } catch (error) {
    console.error("Erro ao sincronizar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao sincronizar usuário" });
  }
}

/**
* Updates the last login timestamp for an existing authenticated user.
* Returns the user's data if found, or null if the user doesn't exist in the database.
* Called by the frontend after Firebase authentication to refresh session data.
*/
export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { uid } = req.firebaseUser!;

    let user = await User.findOne({ firebaseUid: uid });
    debug("login: Usuário encontrado no DB?:", user);

    if (user) {
      debug("login: Usuário existente encontrado, atualizando dados.");

      user.lastLogin = new Date();
      await user.save();
      debug("login: Usuário atualizado:", user);
    }
    

    return res.json({ user });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro interno ao fazer login" });
  }
}




/**
 * Retorna os dados do usuário autenticado.
 */
export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser!.uid });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}