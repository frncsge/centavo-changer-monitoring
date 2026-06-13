import pool from "../../config/dbConfig.js";

export const storeAdjustment = async ({
  adminId,
  machineId,
  pesoValue,
  quantityChange,
  reason,
}) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO adjustments (machine_id, peso_value, quantity_change, reason)
        SELECT $1, $2, $3, $4
        WHERE EXISTS (
            SELECT 1
            FROM machines m
            JOIN admins a ON m.admin_id = a.admin_id
            WHERE m.machine_id = $1
            AND a.supabase_uid = $5
        )
        RETURNING *
      `,
      [machineId, pesoValue, quantityChange, reason, adminId],
    );

    return result.rows[0];
  } catch (error) {
    console.error(
      "An error occured while trying to save machine storage adjustment to the database:",
      error,
    );
    throw error;
  }
};
