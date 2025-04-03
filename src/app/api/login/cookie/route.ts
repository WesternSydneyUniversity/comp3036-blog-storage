import { sessionStore } from "@/app/lib/store";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // TODO: Set a secure 'session_id' cookie with value 'abc789xyz'
  // Use httpOnly, secure (in production), sameSite: 'strict', maxAge of 1 hour

  if (!process.env.PASSWORD) {
    throw new Error("PASSWORD is not defined in environment variables");
  }

  const body = await req.json();
  const cookieStore = await cookies();

  if (process.env.PASSWORD !== body.password) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json(
    { message: "Admin access granted to " + body.user },
    { status: 200 }
  );

  const sessionID = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // store session in memory
  sessionStore.set(sessionID, body.user);

  // add session_id cookie
  response.cookies.set("session_id", sessionID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
