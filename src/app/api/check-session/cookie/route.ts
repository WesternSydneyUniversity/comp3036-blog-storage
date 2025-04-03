import { sessionStore } from "@/app/lib/store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();

  const sessionID = cookieStore.get("session_id")?.value;
  if (!sessionID) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  if (!sessionStore.has(sessionID)) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }
  return NextResponse.json(
    { message: "Admin access granted to " + sessionStore.get(sessionID) },
    { status: 200 }
  );
}
