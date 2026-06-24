import crypto from "crypto";

export function generateRefreshToken() {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  return refreshToken;
}
