import { NextRequest, NextResponse } from "next/server";
import { wagazaJson, type PublicUser } from "@/lib/wagaza";
import { sessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const data = await wagazaJson<{ token: string; user: PublicUser }>(
      "/api/v1/auth/login",
      { method: "POST", body: { email, password } }
    );
    const res = NextResponse.json({ user: data.user });
    res.cookies.set(sessionCookie(data.token));
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "login failed" },
      { status: 401 }
    );
  }
}
