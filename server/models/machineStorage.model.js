import pool from "../../config/dbConfig.js";

export const fetchMachineStorage = async (userId) => {
  try {
    const result = await pool.query(
      `
        SELECT
            ms.*
        FROM machine_storage ms
        JOIN machines m ON ms.machine_id = m.machine_id
        JOIN admins a ON m.admin_id = a.admin_id
        WHERE a.supabase_uid = $1
        ORDER BY ms.peso_value ASC;
    `,
      [userId],
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

export const storeRefill = async ({ machineId, pesoValue, quantity }) => {
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

    await client.query(
      `
        INSERT INTO peso_refilled
        VALUES ($1, $2, $3)
      `,
      [refillId, pesoValue, quantity],
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
