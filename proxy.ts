import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  if (!req.cookies.get("wgz") && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
