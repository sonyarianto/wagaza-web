"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
      setMsg("✅ Masuk antrean! Tunggu approve, terus buka nomornya buat pairing. 🎉");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "failed");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center gap-3 mb-6">
          <h1 className="font-display font-bold text-3xl tracking-tight">
            Nomorku <span className="font-hand text-2xl text-slate-500">eh, nomor-nomorku~</span>
          </h1>
          <Button variant="ghost" size="sm" onClick={logout} className="ml-auto rounded-full font-display">
            Keluar 👋
          </Button>
        </header>

        <Card className="rounded-3xl border-2 shadow-[6px_6px_0_#1e1b4b] mb-4 rotate-[0.5deg]">
          <CardHeader>
            <CardTitle className="font-display text-xl">📲 Daftarkan nomor WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={registerNumber} className="flex gap-2">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="cth. 62812xxxxxxx" className="rounded-xl border-2" />
              <Button className="rounded-full shrink-0 font-display bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0_#1e1b4b]">
                Daftar
              </Button>
            </form>
            {msg && <p className="text-sm text-slate-500 mt-2">{msg}</p>}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 shadow-[6px_6px_0_#1e1b4b] -rotate-[0.5deg]">
          <CardContent className="p-2">
            {instances.length === 0 && (
              <p className="text-sm text-slate-400 p-4">
                Kosong melompong~ 🍃 Daftarkan satu nomor di atas yuk! 👆
              </p>
            )}
            {instances.map((i) => (
              <Link key={i.id} href={`/dashboard/${i.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50">
                <span className="font-mono font-medium">{i.id}</span>
                <Badge variant={i.logged_in ? "default" : "secondary"} className="rounded-full">
                  {i.logged_in ? "✅ paired" : "⏳ belum pair"}
                </Badge>
                <span className="ml-auto text-slate-300">→</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <p className="mt-6 text-center">
          <Link href="/docs" className="font-display text-sm text-slate-400 hover:text-slate-800">
            📖 API docs →
          </Link>
        </p>
      </div>
    </main>
  );
}
