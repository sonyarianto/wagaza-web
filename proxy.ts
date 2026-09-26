import { NextRequest, NextResponse } from "next/server";

const GATED = ["/dashboard", "/docs"];

export default function proxy(req: NextRequest) {
  if (!req.cookies.get("wgz") && GATED.some((p) => req.nextUrl.pathname.startsWith(p))) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/docs"] };
