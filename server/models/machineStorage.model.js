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
        WHERE a.supabase_uid = $1;
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
