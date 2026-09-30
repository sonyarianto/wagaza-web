import { NextRequest, NextResponse } from "next/server";
import { wagaza, wagazaJson, type InstanceSummary } from "@/lib/wagaza";
import { getSession } from "@/lib/session";

// (method, path-pattern) pairs the browser may use. :id segments are
// ownership-checked against /me/instances before proxying with master key.
const GET_OK = new Set([
  "me/instances",
  "instances/:id/status",
  "instances/:id/session/qr",
  "instances/:id/session/qr.svg",
  "instances/:id/messages",
  "instances/:id/messages/export",
  "instances/:id/users",
  "instances/:id/webhook",
  "instances/:id/identity/mappings",
]);
const POST_OK = new Set([
  "registrations",
  "instances/:id/session/pair",
  "instances/:id/messages/send",
  "instances/:id/messages/:row/resend",
  "instances/:id/webhook",
  "instances/:id/users/register",
  "instances/:id/identity/mapping",
  "instances/:id/identity/backfill",
]);
const DELETE_OK = new Set(["instances/:id/users/:phone"]);

function allowed(method: string, parts: string[]): { id?: string } | null {
  const key = parts
    .map((seg, i) => (i === 1 && parts[0] === "instances" ? ":id" : seg))
    .join("/");
  const paramSwap = parts
    .map((seg, i) => {
      if (i === 1 && parts[0] === "instances") return ":id";
      if (i === 3 && parts[0] === "instances" && parts[2] === "users") return ":phone";
      if (i === 3 && parts[0] === "instances" && parts[2] === "messages") return ":row";
      return seg;
    })
    .join("/");
  const set =
    method === "GET" ? GET_OK : method === "POST" ? POST_OK : method === "DELETE" ? DELETE_OK : null;
  if (!set) return null;
  if (set.has(key) || set.has(paramSwap)) {
    return parts[0] === "instances" ? { id: parts[1] } : {};
  }
  return null;
}

async function ownedIds(session: string): Promise<Set<string>> {
  const data = await wagazaJson<{ instances: InstanceSummary[] }>("/api/v1/me/instances", {
    session,
  });
  return new Set(data.instances.map((i) => i.id));
}

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ p: string[] }> },
  method: string
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "not logged in" }, { status: 401 });
  }
  const { p } = await ctx.params;
  const rule = allowed(method, p);
  if (!rule) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    if (rule.id) {
      // Ownership check for instance-scoped routes.
      const mine = await ownedIds(session);
      if (!mine.has(rule.id)) {
        return NextResponse.json({ error: "not your instance" }, { status: 403 });
      }
    }
    let body: unknown = undefined;
    if (method === "POST") {
      body = await req.json().catch(() => ({}));
      if (rule.id === undefined && p.join("/") === "registrations" && typeof body === "object" && body !== null) {
        // Bind new registrations to the logged-in user automatically.
        const me = await wagazaJson<{ id: string }>("/api/v1/auth/me", { session }).catch(() => null);
        if (me) (body as Record<string, unknown>).owner_user_id = me.id;
      }
    }
    const query = req.nextUrl.search;
    // /me/* is user-scoped: forward the session token itself.
    // Everything else goes with the server-side master key.
    const sessionOrMaster =
      p[0] === "me" ? { session } : { master: true as const };
    const upstream = await wagaza(`/api/v1/${p.join("/")}${query}`, {
      method,
      ...sessionOrMaster,
      body,
    });
    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstream.status });
    }
    // Binary passthrough (e.g. QR SVG image).
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "proxy failed" },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ p: string[] }> }) {
  return proxy(req, ctx, "GET");
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ p: string[] }> }) {
  return proxy(req, ctx, "POST");
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ p: string[] }> }) {
  return proxy(req, ctx, "DELETE");
}
