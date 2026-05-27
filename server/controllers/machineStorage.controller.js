import { fetchMachineStorage } from "../models/machineStorage.model.js";

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
