import {
  fetchMachineStorage,
  storeRefill,
} from "../models/machineStorage.model.js";

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
  const pesoValue = Number(req.body.pesoValue);
  const quantity = Number(req.body.quantity);

  if (!pesoValue || !quantity)
    return res
      .status(400)
      .json({ message: "Peso value and its quantity are required" });

  if (isNaN(pesoValue) || isNaN(quantity))
    return res
      .status(400)
      .json({ message: "Peso value and quantity must be a number" });

  if (quantity < 1)
    return res.status(400).json({ message: "Quantity must be more than one" });

  try {
    const refillId = await storeRefill({ machineId: 8, pesoValue, quantity });

    res.status(201).json({ message: "Refill successful" });
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
