import {
  fetchTransactions,
  storeNewTransaction,
} from "../models/transactions.model.js";

export const getTransactions = async (req, res) => {
  try {
    const machineId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    // machine id required and should be a number
    if (!Number.isInteger(machineId) || machineId <= 0)
      return res.status(400).json({
        message: "Invalid machine ID",
      });

    const offset = (page - 1) * limit;

    const { totalCount, transactions } = await fetchTransactions({
      adminId: "e947d75a-7ff1-4ecb-b339-cc9e9f3506fc",
      machineId,
      limit,
      offset,
    });

    res.status(200).json({ totalCount, transactions });
  } catch (error) {
    console.error("An error occured while trying to get transactions:", error);
    res.status(500).json({
      message:
        "Server error. An error occured while trying to get transactions",
    });
  }
};

export const createTransaction = async (req, res) => {
  const { id: machineId } = req.params;
  const { data } = req.body;

  if (!data) return res.status(400).json({ message: "No data is received" });

  if (typeof data !== "object" || !Array.isArray(data.dispensed))
    return res.status(400).json({ message: "Invalid transaction data" });

  try {
    await storeNewTransaction({
      machineId: machineId,
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
