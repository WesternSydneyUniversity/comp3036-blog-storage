import { createToken } from "@/app/lib/jwt";
import { tokenStore } from "@/app/lib/store";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const bearerToken = req.headers.get("Authorization");
  if (!bearerToken) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  const tokenString = bearerToken.split(" ")[1];
  if (!tokenString || tokenString == "null") {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  // TODO: Check if JWT token is valid and not expired
  try {
    const { user } = jwt.verify(tokenString, process.env.JWT_SECRET) as {
      user: string;
    };
    if (!user) {
      return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Admin access granted to " + user },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.name === "TokenExpiredError") {
      // we get the refresh token and it is valid we issue a new token
      const cookieStore = await cookies();
      const refreshCookie = cookieStore.get("refreshToken")?.value;

      console.log(Array.from(tokenStore.keys()));

      if (refreshCookie && tokenStore.has(refreshCookie)) {
        return NextResponse.json(
          {
            message: "Token Reissued",
            token: createToken(tokenStore.get(refreshCookie)!),
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "Token Expired" }, { status: 401 });
      }
    }
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}
