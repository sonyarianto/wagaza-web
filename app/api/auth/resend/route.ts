import { NextRequest, NextResponse } from "next/server";
import { WAGAZA_API_URL } from "@/lib/wagaza";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  await fetch(`${WAGAZA_API_URL}/api/v1/auth/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email || "" }),
  }).catch(() => null);
  // Always ok: never reveal whether the email exists.
  return NextResponse.json({ ok: true });
}
