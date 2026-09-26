import { NextRequest, NextResponse } from "next/server";
import { wagazaJson, type PublicUser } from "@/lib/wagaza";
import { sessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const data = await wagazaJson<{ token: string; user: PublicUser }>(
      "/api/v1/auth/register",
      { method: "POST", body: { email, password } }
    );
    const res = NextResponse.json({ user: data.user }, { status: 201 });
    res.cookies.set(sessionCookie(data.token));
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "register failed";
    const status = /taken/.test(msg) ? 409 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
