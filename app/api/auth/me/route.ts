import { NextResponse } from "next/server";
import { wagaJson, type PublicUser } from "@/lib/waga";
import { getSession } from "@/lib/session";

export async function GET() {
  const token = await getSession();
  if (!token) return NextResponse.json({ error: "not logged in" }, { status: 401 });
  try {
    const user = await wagaJson<PublicUser>("/api/v1/auth/me", { session: token });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "session expired" }, { status: 401 });
  }
}
