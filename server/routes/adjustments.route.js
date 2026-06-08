import express from "express";
import { createAdjustment } from "../controllers/adjustments.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/machines/:id/storage/adjustments",
//   authenticateUser,
  createAdjustment,
);

export default router;
