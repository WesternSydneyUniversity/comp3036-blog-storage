import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // TODO: Check if JWT token is valid and not expired
  try {
    const token = jwt.verify("", process.env.JWT_SECRET);
  } catch (error) {}

  return NextResponse.json(
    { message: "Check not implemented" },
    { status: 501 }
  );
}
