import express from "express";
import {
  getTransactions,
  createTransaction,
} from "../controllers/transactions.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/machines/:id/transactions", authenticateUser, getTransactions);
router.post("/machines/:id/transactions", authenticateUser, createTransaction);

export default router;
