import express from "express";
import { getMachineStorage } from "../controllers/machineStorage.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/machine-storage", authenticateUser, getMachineStorage);

export default router;
