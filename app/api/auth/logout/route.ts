import { NextResponse } from "next/server";
import { wagaza } from "@/lib/wagaza";
import { clearSessionCookie, getSession } from "@/lib/session";

export async function POST() {
  const token = await getSession();
  if (token) {
    // Best effort: invalidate server-side too.
    await wagaza("/api/v1/auth/logout", { method: "POST", session: token }).catch(
      () => null
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearSessionCookie());
  return res;
}
