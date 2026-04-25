import { generateAccessToken, generateRefreshToken } from "./token.util.js";
import redisClient from "../../config/redisConfig.js";

// for creatinf user session
export async function createSession({
  res,
  userId,
  accessToken,
  refreshToken,
}) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // expires in 15 mins
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days
  });

  // store refresh token in redis
  await redisClient.setEx(
    `refresh:${refreshToken}`,
    7 * 24 * 60 * 60,
    String(userId),
  );
}

export async function clearSession(res, refreshToken) {
  // clear refresh token in redis
  if (refreshToken) {
    await redisClient.del(`refresh:${refreshToken}`);
  }

  // clear access and refresh token cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
