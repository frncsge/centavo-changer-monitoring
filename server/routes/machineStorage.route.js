import express from "express";
import {
  getMachineStorage,
  refillMachineStorage,
} from "../controllers/machineStorage.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/machine-storage", authenticateUser, getMachineStorage);
router.post("/machine-storage", refillMachineStorage);

export default router;
