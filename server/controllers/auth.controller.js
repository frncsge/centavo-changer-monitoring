import { getAdminByEmail } from "../models/admins.model.js";
import { isValidEmail } from "../utils/email.util.js";
import { isValidPassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";
import { createSession } from "../utils/session.util.js";
import bcrypt from "bcrypt";

const saltRounds = 12;

export async function login(req, res) {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  // email and password must have input
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  // simple check for email format
  if (!isValidEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

  // quick password check (must be at least 8 chars long)
  if (!isValidPassword(password))
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });

  try {
    // fetch the admin account using the inputted email
    const admin = await getAdminByEmail(email);

    // if no rows are returned, it means no account existed with the inputted email
    if (admin.rowCount === 0) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    // if account exists, check if the password is correct
    const storedHashedPassword = admin.rows[0].hashed_password;
    const passwordsMatch = await bcrypt.compare(password, storedHashedPassword); // this returns true if passwords match

    // if passwords dont match
    if (!passwordsMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // if passwords match, create user session
    const adminId = admin.rows[0].admin_id;
    const accessToken = generateAccessToken(adminId);
    const refreshToken = generateRefreshToken(adminId);

    await createSession({ res, userId: adminId, accessToken, refreshToken });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("An error occured while trying to log in:", error);
    res.status(500).json({
      message: "Server error. An error occured while trying to log in.",
    });
  }
}
