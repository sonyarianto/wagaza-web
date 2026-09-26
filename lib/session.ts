import { cookies } from "next/headers";

export const SESSION_COOKIE = "wgz";
const THIRTY_DAYS = 30 * 24 * 3600;

export async function getSession(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value || null;
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: THIRTY_DAYS,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  };
}
