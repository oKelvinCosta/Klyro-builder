import express from "express";
import { getMe, login, syncUser } from "../controllers/authController.ts";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.ts";

const router = express.Router();

router.post("/sync", verifyFirebaseToken, syncUser);
router.post("/login", verifyFirebaseToken, login);
router.get("/me", verifyFirebaseToken, getMe);

export default router;