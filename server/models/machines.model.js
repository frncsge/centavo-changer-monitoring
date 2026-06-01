import pool from "../../config/dbConfig.js";

export const fetchAllMachines = async (adminId) => {
  try {
    const result = await pool.query(
      "SELECT m.* FROM machines m JOIN admins a ON a.admin_id = m.admin_id WHERE a.supabase_uid = $1",
      [adminId],
    );

    return result.rows;
  } catch (error) {
    console.error(
      "An error occured while trying to fetch all machines of an admin from the database:",
      error,
    );
    throw error;
  }
};

export const fetchMachineStorage = async (machineId) => {
  try {
    const result = await pool.query(
      `
        SELECT 
          machine_id,
          peso_value,
          SUM(quantity) AS quantity
        FROM (
          SELECT
            r.machine_id,
            pr.peso_value,
            pr.quantity
          FROM peso_refilled pr
          JOIN refills r ON r.refill_id = pr.refill_id
          WHERE r.machine_id = $1

          UNION ALL

          SELECT
            txn.machine_id,
            pd.peso_value,
            -pd.quantity 
          FROM peso_dispensed pd
          JOIN transactions txn ON txn.transaction_id = pd.transaction_id
          WHERE txn.machine_id = $1
        ) event
        GROUP BY machine_id, peso_value
        ORDER BY peso_value ASC;
    `,
      [machineId],
    );

    return result.rows;
  } catch (error) {
    console.error(
      "An error occured while trying to fetch machine storage from the database:",
      error,
    );
    throw error;
  }
};

export const storeRefill = async ({
  machineId,
  refillData = [{ pesoValue: "", quantity: "" }],
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        INSERT INTO refills (machine_id)
        VALUES ($1)
        RETURNING refill_id;
      `,
      [machineId],
    );

    const refillId = result.rows[0].refill_id;

    // dynamically build the sql query
    const placeholders = [];
    const values = [];

    refillData.forEach((data, i) => {
      const offset = i * 3;

      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);

      values.push(refillId, data.pesoValue, data.quantity);
    });

    await client.query(
      `
        INSERT INTO peso_refilled
        VALUES ${placeholders.join(", ")}
      `,
      values,
    );

    await client.query("COMMIT");
  } catch (error) {
    if (client) await client.query("ROLLBACK");

    console.error(
      "An error occured while trying to create a machine storage refill record to the database:",
      error,
    );
    throw error;
  } finally {
    client.release();
  }
};
