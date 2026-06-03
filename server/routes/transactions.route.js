import express from "express";
import {
  getTransactions,
  createTransaction,
} from "../controllers/transactions.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/machines/:id/transactions", getTransactions);
router.post("/machines/:id/transactions", createTransaction);

export default router;
