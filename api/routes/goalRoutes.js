import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getGoals, createGoal } from "../controllers/goalController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getGoals);
router.post("/", createGoal);

export default router;
