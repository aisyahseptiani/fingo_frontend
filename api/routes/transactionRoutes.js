import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getTransactions, createTransaction, getSummary, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/summary", getSummary);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
