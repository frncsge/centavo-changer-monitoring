import express from "express";
import { getTransactions } from "../controllers/transactions.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/transactions", authenticateUser, getTransactions);

export default router;
