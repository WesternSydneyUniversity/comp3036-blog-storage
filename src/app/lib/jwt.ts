import jwt from "jsonwebtoken";
export function createToken(user: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRATION as any) || "15m",
  });
}
