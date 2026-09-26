import { NextResponse } from "next/server";
import { waga } from "@/lib/waga";
import { clearSessionCookie, getSession } from "@/lib/session";

export async function POST() {
  const token = await getSession();
  if (token) {
    // Best effort: invalidate server-side too.
    await waga("/api/v1/auth/logout", { method: "POST", session: token }).catch(
      () => null
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearSessionCookie());
  return res;
}
