"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Status = { id: string; connected: boolean; logged_in: boolean; has_qr: boolean; uptime_secs: number };
type Msg = {
  id: number; message_id: string; sender: string; sender_pn: string | null;
  chat: string; text: string | null; media_kind: string | null; status: string;
};

async function api(path: string, opts?: RequestInit) {
  const r = await fetch(path, opts);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
  return body;
}

export default function InstanceDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [qrOk, setQrOk] = useState<boolean | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [webhook, setWebhook] = useState("");
  const [out, setOut] = useState("");
  const [qrTick, setQrTick] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      const s = await api(`/api/w/instances/${id}/status`);
      setStatus(s);
      const q = await api(`/api/w/instances/${id}/session/qr`);
      setPairCode(q.paired ? null : q.pair_code || null);
      setQrOk(q.paired ? true : !!q.qr);
      const m = await api(`/api/w/instances/${id}/messages?limit=20`);
      // Status broadcasts (stories) are skipped server-side for new
      // traffic; hide any rows logged before that filter existed.
      setMsgs((m as Msg[]).filter((msg) => msg.chat !== "status@broadcast"));
    } catch (e) {
      if (e instanceof Error && /not logged in|session|not your instance/i.test(e.message)) {
        router.push("/dashboard");
      } else setOut(e instanceof Error ? e.message : "load failed");
    }
  }, [id, router]);

  useEffect(() => {
    load();
    const t = setInterval(() => {
      load();
      setQrTick(Date.now());
    }, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setOut("");
    try {
      const r = await api(`/api/w/instances/${id}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text }),
      });
      setOut(`✅ Terkirim: ${r.message_id}`);
      setText("");
    } catch (e) {
      setOut(e instanceof Error ? e.message : "send failed");
    }
  }

  async function saveWebhook(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api(`/api/w/instances/${id}/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhook || null }),
      });
      setOut("✅ Webhook tersimpan.");
    } catch (e) {
      setOut(e instanceof Error ? e.message : "failed");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="mb-4">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-emerald-600">← Nomorku</Link>
        </p>
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-extrabold font-mono">{id}</h1>
          {status && (
            <Badge variant={status.logged_in ? "default" : "secondary"} className="rounded-full">
              {status.logged_in ? "✅ paired" : "⏳ belum pair"}
            </Badge>
          )}
        </div>

        {status && !status.logged_in && (
          <Card className="rounded-3xl border-2 border-amber-200 bg-amber-50/60 mb-4">
            <CardHeader>
              <CardTitle>📱 Pairing dulu yuk!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {qrOk === true ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/w/instances/${id}/session/qr.svg?t=${qrTick}`} alt="Scan to pair"
                    className="mx-auto bg-white p-3 rounded-2xl w-64 h-64 shadow-md" />
                  <p className="text-xs text-slate-500 mt-2">
                    WhatsApp → Perangkat Tertaut → Tautkan
                    {pairCode && (
                      <> · atau kode <span className="font-mono text-lg font-bold tracking-widest">{pairCode}</span></>
                    )}
                  </p>
                </>
              ) : qrOk === false ? (
                <div className="py-4">
                  <div className="text-4xl mb-2">🥲</div>
                  <p className="font-display font-semibold">QR kedaluwarsa / belum tersedia</p>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    Sesi perlu pairing ulang oleh admin. Hubungi admin/support ya~
                    {pairCode && (
                      <> · atau kode <span className="font-mono text-lg font-bold tracking-widest">{pairCode}</span></>
                    )}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={load} className="rounded-full">
                    Muat ulang 🔄
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-8">Memuat QR… ⏳</p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="rounded-3xl border-2 mb-4">
          <CardHeader><CardTitle>💌 Kirim pesan tes</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={send} className="flex gap-2 flex-wrap">
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Ke: 628xx"
                className="w-44 rounded-xl" />
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan…"
                className="flex-1 min-w-[160px] rounded-xl" />
              <Button type="submit" className="rounded-full">Kirim</Button>
            </form>
            {out && <p className="text-xs text-slate-500 mt-2">{out}</p>}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 mb-4">
          <CardHeader><CardTitle>🔔 Webhook</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveWebhook} className="flex gap-2">
              <Input value={webhook} onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://servermu/webhook (kosongkan = hapus)"
                className="rounded-xl" />
              <Button type="submit" variant="outline" className="rounded-full shrink-0">Simpan</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2">
          <CardHeader><CardTitle>📨 Pesan terbaru</CardTitle></CardHeader>
          <CardContent>
            {msgs.length === 0 && <p className="text-sm text-slate-400">Belum ada. Coba kirim sesuatu ke nomor ini! 👆</p>}
            {msgs.map((m) => (
              <div key={m.id} className="py-2 border-b last:border-0 text-sm">
                <span className="font-mono text-xs bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">
                  {m.sender_pn || m.sender}
                </span>
                <p className="mt-1">
                  {m.text || <span className="italic text-slate-400">[{m.media_kind || "non-text"}]</span>}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Label className="text-xs text-slate-400">Butuh yang advance? Pakai API langsung 👇</Label>
          <pre className="text-xs bg-slate-900 text-emerald-200 rounded-2xl p-4 mt-2 overflow-x-auto">
            POST /api/v1/instances/{id}/messages/send{"\n"}
            GET  /api/v1/instances/{id}/messages?from=&limit=
          </pre>
        </div>
      </div>
    </main>
  );
}
