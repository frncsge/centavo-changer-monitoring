import express from "express";
import { getTransactions, createTransaction } from "../controllers/transactions.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/transactions", authenticateUser, getTransactions);
router.post("/transactions", createTransaction);

export default router;
