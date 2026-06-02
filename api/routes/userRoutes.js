import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

import { requireAuth } from "../middleware/auth.js";

router.use(requireAuth);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/change-password", changePassword);

export default router;
