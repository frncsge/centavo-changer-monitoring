import pool from "../../config/dbConfig.js";

export const fetchTransactions = async () => {
  try {
    const result = await pool.query(`
        SELECT 
          txn.*,
	        json_agg(
            json_build_object(
              'peso_value', pd.peso_value,
              'quantity', pd.quantity
            )
          ) AS dispensed
        FROM transactions txn
        JOIN peso_dispensed pd ON txn.transaction_id = pd.transaction_id
        JOIN machines m ON txn.machine_id = m.machine_id
        JOIN admins a ON m.admin_id = a.admin_id
        WHERE a.supabase_uid = 'e947d75a-7ff1-4ecb-b339-cc9e9f3506fc'
        GROUP BY txn.transaction_id, txn.machine_id, txn.centavos_25_inserted
        ORDER BY txn.transaction_date_time DESC;
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
