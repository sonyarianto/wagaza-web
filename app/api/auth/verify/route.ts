import { NextRequest, NextResponse } from "next/server";
import { WAGAZA_API_URL } from "@/lib/wagaza";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  const upstream = await fetch(
    `${WAGAZA_API_URL}/api/v1/auth/verify?token=${encodeURIComponent(token)}`,
    { cache: "no-store" }
  );
  const body = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(body, { status: upstream.status });
  }
  const res = NextResponse.json(body);
  const token2 = (body as { token?: string }).token;
  if (token2) {
    res.cookies.set({
      name: "wgz",
      value: token2,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 3600,
    });
  }
  return res;
}
