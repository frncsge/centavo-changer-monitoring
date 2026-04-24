import pool from "../../config/dbConfig.js";

export const fetchTransactions = async () => {
  try {
    const result = await pool.query(`
        SELECT 
          txn.*,
	        pd.peso_value,
	        pd.quantity
        FROM transactions txn
        JOIN peso_dispensed pd ON txn.transaction_id = pd.transaction_id;
      `);
    return result.rows;
  } catch (error) {
    console.error(
      "An error occured while trying to fetch transactions from the database:",
      error,
    );
    throw error;
  }
};
