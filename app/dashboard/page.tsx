"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Instance = { id: string; connected: boolean; logged_in: boolean; has_qr: boolean };

async function api(path: string, opts?: RequestInit) {
  const r = await fetch(path, opts);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
  return body;
}

export default function Dashboard() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function load() {
    try {
      const d = await api("/api/w/me/instances");
      setInstances(d.instances);
    } catch (e) {
      if (e instanceof Error && /not logged in|session/i.test(e.message)) router.push("/login");
      else setMsg(e instanceof Error ? e.message : "load failed");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function registerNumber(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/w/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setPhone("");
      setMsg("Request submitted — wait for operator approval, then open the instance to pair.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "failed");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold">My numbers</h1>
          <button onClick={logout} className="ml-auto text-sm text-slate-400 hover:text-white">
            Logout
          </button>
        </header>

        <form onSubmit={registerNumber} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
          <h2 className="font-semibold mb-2">Register a WhatsApp number</h2>
          <div className="flex gap-2">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 62812xxxxxxx"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            <button className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 text-sm font-medium">
              Register
            </button>
          </div>
          {msg && <p className="text-sm text-slate-400 mt-2">{msg}</p>}
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          {instances.length === 0 && (
            <p className="text-sm text-slate-500">No instances yet. Register a number above.</p>
          )}
          {instances.map((i) => (
            <Link key={i.id} href={`/dashboard/${i.id}`}
              className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 rounded px-2">
              <span className="font-mono font-medium">{i.id}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${i.logged_in ? "bg-emerald-900 text-emerald-300" : "bg-red-950 text-red-300"}`}>
                {i.logged_in ? "paired" : "not paired"}
              </span>
              <span className="ml-auto text-slate-500">→</span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center">
          <Link href="/docs" className="text-sm text-slate-500 hover:text-slate-300">API docs →</Link>
        </p>
      </div>
    </main>
  );
}
