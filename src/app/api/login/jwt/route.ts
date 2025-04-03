import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign("", process.env.JWT_SECRET);

  return NextResponse.json(
    {
      message: "Logged in!",
    },
    { status: 200 }
  );
}
