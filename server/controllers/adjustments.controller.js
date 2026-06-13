import { isValidNumber } from "../utils/number.util.js";
import { storeAdjustment } from "../models/adjustments.model.js";

export const createAdjustment = async (req, res) => {
  const { id: machineId } = req.params;
  const { pesoValue, quantityChange, reason } = req.body;

  if (!isValidNumber(machineId))
    return res.status(400).json({
      message: "Machine Id is required and must be a positive number",
    });

  if (!isValidNumber(pesoValue) || pesoValue <= 0)
    return res.status(400).json({
      message: "Peso value is required and must be P1, P5, P10, or P20",
    });

  if (!isValidNumber(quantityChange))
    return res
      .status(400)
      .json({ message: "Quantity change is required and must be a number" });

  try {
    const adjustment = await storeAdjustment({
      adminId: req.user.id,
      machineId,
      pesoValue,
      quantityChange,
      reason,
    });

    if (!adjustment)
      return res.status(403).json({
        message: "You are not allowed to make any changes to this machine",
      });

    res.status(201).json({ adjustment });
  } catch (error) {
    if (error.code === "23514")
      res.status(400).json({
        message: "Invalid peso value. Please only include P1, P5, P10, and P20",
      });

    console.error(
      "An error occured while trying to create machine storage adjustment:",
      error,
    );
    res.status(500).json({
      message:
        "Server error. An error occured while trying to create machine storage adjustment",
    });
  }
};
