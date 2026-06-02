import express from "express";
import { getProfile, updateProfile, changePassword, getSessions, revokeSession } from "../controllers/userController.js";

const router = express.Router();

import { requireAuth } from "../middleware/auth.js";

router.use(requireAuth);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/change-password", changePassword);
router.get("/sessions", getSessions);
router.delete("/sessions/:token", revokeSession);

export default router;
