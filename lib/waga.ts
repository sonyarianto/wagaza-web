export const WAGA_API_URL = (process.env.WAGA_API_URL || "").replace(/\/$/, "");
export const WAGA_API_KEY = process.env.WAGA_API_KEY || "";

if (!WAGA_API_URL && process.env.NODE_ENV === "production") {
  console.warn("[waga] WAGA_API_URL is not set");
}

type WagaOpts = {
  method?: string;
  // Session token (website user) or master key. Exactly one should be set.
  session?: string;
  master?: boolean;
  body?: unknown;
};

/** Server-side fetch to the Waga gateway. Never called from the browser. */
export async function waga(path: string, opts: WagaOpts = {}): Promise<Response> {
  if (!WAGA_API_URL) throw new Error("WAGA_API_URL is not configured");
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.session) headers["Authorization"] = `Bearer ${opts.session}`;
  else if (opts.master) {
    if (!WAGA_API_KEY) throw new Error("WAGA_API_KEY is not configured");
    headers["Authorization"] = `Bearer ${WAGA_API_KEY}`;
  }
  return fetch(`${WAGA_API_URL}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    cache: "no-store",
  });
}

export async function wagaJson<T>(path: string, opts: WagaOpts = {}): Promise<T> {
  const res = await waga(path, opts);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (body as { error?: string }).error || `Waga API ${res.status}`;
    throw new Error(err);
  }
  return body as T;
}

export type PublicUser = { id: string; email: string; created_at: number };
export type InstanceSummary = {
  id: string;
  connected: boolean;
  logged_in: boolean;
  has_qr: boolean;
};
