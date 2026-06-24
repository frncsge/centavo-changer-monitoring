import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authenticateUser, getDashboardSummary);

export default router;
