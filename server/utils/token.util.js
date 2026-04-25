import jwt from "jsonwebtoken";

// access token (short-lived). expires in 15 mins. payload is the user/admin's id
export function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

// refresh token (long-lived). payload is still the user/admin's id. this will be stored in redis
export function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET);
}
