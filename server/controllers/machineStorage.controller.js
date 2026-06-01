import {
  fetchMachineStorage,
  storeRefill,
} from "../models/machineStorage.model.js";
import { isValidNumber } from "../utils/number.util.js";

export const getMachineStorage = async (req, res) => {
  try {
    const storage = await fetchMachineStorage(req.user.id);

    res.status(200).json({ storage });
  } catch (error) {
    console.error(
      "An error occured while trying to get machine storage:",
      error,
    );
    res.status(500).json({
      message:
        "Server error. An error occured while trying to get machine storage",
    });
  }
};

export const refillMachineStorage = async (req, res) => {
  const { refillData } = req.body;

  if (!refillData)
    return res.status(400).json({
      message: "Refill data is required",
      refillData: [{ pesoValue: "(Number)", quantity: "(Number" }],
    });

  if (!Array.isArray(refillData))
    return res.status(400).json({
      message: "Refill data must be an array of objects",
      refillData: [{ pesoValue: "(Number)", quantity: "(Number" }],
    });

  if (
    !refillData.every(
      (data) => isValidNumber(data.pesoValue) && isValidNumber(data.quantity),
    )
  )
    return res.status(400).json({
      message: "Peso value and quantity must be a valid number",
      refillData: [{ pesoValue: "(Number)", quantity: "(Number" }],
    });

  try {
    const refillId = await storeRefill({
      machineId: 8,
      refillData,
    });

    res.status(201).json({ message: "Refill successful" });
  } catch (error) {
    if (error.code === "23514")
      res
        .status(400)
        .json({
          message:
            "Invalid peso value. Please only include P1, P5, P10, and P20",
        });

    console.error(
      "An error occured while trying to refill machine storage:",
      error,
    );
    res.status(500).json({
      message:
        "Server error. An error occured while trying to refill machine storage",
    });
  }
};
