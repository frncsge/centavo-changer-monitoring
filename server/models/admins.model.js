import pool from "../../config/dbConfig.js";

export async function getAdminByEmail(email){
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    return result;
}
