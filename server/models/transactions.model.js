import pool from "../../config/dbConfig.js";

export const fetchTransactions = async ({
  adminId,
  machineId,
  limit,
  offset,
}) => {
  try {
    const countResult = await pool.query(
      `
        SELECT 
          COUNT(*)
        FROM transactions txn
        JOIN machines m ON m.machine_id = txn.machine_id
        JOIN admins a ON a.admin_id = m.admin_id
        WHERE a.supabase_uid = $1 AND m.machine_id = $2;
      `,
      [adminId, machineId],
    );

    const txnResult = await pool.query(
      `
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
        WHERE a.supabase_uid = $1 AND m.machine_id = $2
        GROUP BY txn.transaction_id, txn.machine_id, txn.centavos_25_inserted
        ORDER BY txn.transaction_date_time DESC
        LIMIT $3
        OFFSET $4;
      `,
      [adminId, machineId, limit, offset],
    );

    const totalCount = Number(countResult.rows[0].count);
    const transactions = txnResult.rows;

    return { totalCount, transactions };
  } catch (error) {
    console.error(
      "An error occured while trying to fetch transactions from the database:",
      error,
    );
    throw error;
  }
};

export const storeNewTransaction = async ({
  machineId,
  eventId,
  centavos,
  dispensed,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // store transaction to the transactions table first
    const txnResult = await client.query(
      `
        INSERT INTO transactions (machine_id, event_id, centavos_25_inserted)
        VALUES ($1, $2, $3)
        RETURNING transaction_id;
      `,
      [machineId, eventId, centavos],
    );

    const transactionId = txnResult.rows[0].transaction_id;

    if (dispensed?.length) {
      const placeholders = [];
      const values = [];

      dispensed.forEach((item, index) => {
        placeholders.push(
          `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`,
        );

        values.push(transactionId, item.peso_value, item.quantity);
      });

      // then store the peso dispensed from the same transaction
      await client.query(
        `
        INSERT INTO peso_dispensed (transaction_id, peso_value, quantity)
        VALUES ${placeholders.join(", ")}
      `,
        values,
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    if (client) await client.query("ROLLBACK");

    console.error(
      "An error occured while trying to store a new transaction to the database:",
      error,
    );
    throw error;
  } finally {
    client.release();
  }
};
