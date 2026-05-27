import {
  fetchTransactions,
  storeNewTransaction,
} from "../models/transactions.model.js";

  export const getTransactions = async (req, res) => {
    try {
      const transactions = await fetchTransactions(req.user.id);

      res.status(200).json({ transactions });
    } catch (error) {
      console.error("An error occured while trying to get transactions:", error);
      res.status(500).json({
        message:
          "Server error. An error occured while trying to get transactions",
      });
    }
  };

export const createTransaction = async (req, res) => {
  const { data } = req.body;

  if (!data) return res.status(400).json({ message: "No data is received" });

  if (typeof data !== "object" || !Array.isArray(data.dispensed))
    return res.status(400).json({ message: "Invalid transaction data" });

  try {
    await storeNewTransaction({
      machineId: data.machine_id,
      eventId: data.event_id,
      centavos: data.centavos,
      dispensed: data.dispensed,
    });

    res.status(201).json({ message: "Transaction created successfully" });
  } catch (error) {
    // if duplicate entry
    if (error.code === "23505")
      return res.status(200).json({ message: "Transaction already processed" });

    console.error("An error occured while trying to get transactions:", error);
    res.status(500).json({
      message:
        "Server error. An error occured while trying to get transactions",
    });
  }
};
