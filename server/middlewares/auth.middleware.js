import supabase from "../../config/supabaseAdmin.js";

export async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // verify user with supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ message: "Unauthorized" });

  req.user = user;
  next();
}
