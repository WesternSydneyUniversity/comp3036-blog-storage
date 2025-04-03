import { createToken } from "@/app/lib/jwt";
import { tokenStore } from "@/app/lib/store";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const { password, user } = await req.json();
  if (!password || !user) {
    return NextResponse.json(
      { message: "Missing password or user" },
      { status: 400 }
    );
  }
  if (password !== process.env.PASSWORD) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = createToken(user);

  // generate refresh token
  const refreshToken = [...Array(32)]
    .map(() => Math.random().toString(36)[2])
    .join("");

  const response = NextResponse.json(
    {
      token,
      message: `Admin access granted to ${user}`,
    },
    { status: 200 }
  );

  tokenStore.set(refreshToken, user);
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
