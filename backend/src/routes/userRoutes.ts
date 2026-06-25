import express from "express";
import { getUserById, getUsers, updateUser } from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, getUsers);
router.get("/:id", verifyFirebaseToken, getUserById);
router.put("/:id", verifyFirebaseToken, updateUser);

// Rota de criação (POST "/") foi removida.
// Novos usuários só são criados via /api/auth/sync (ver authController.syncUser).

export default router;