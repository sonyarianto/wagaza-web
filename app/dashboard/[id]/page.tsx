"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [replyTo, setReplyTo] = useState<{ id: number; sender: string; snippet: string } | null>(null);
  const [webhook, setWebhook] = useState("");
  // Prefill the saved URL once; periodic refreshes must not clobber typing.
  const webhookTouched = useRef(false);
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
      if (!webhookTouched.current) {
        const w = await api(`/api/w/instances/${id}/webhook`);
        setWebhook(typeof w.url === "string" ? w.url : "");
      }
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
      // Quoting: destination comes from the quoted message, so `to` is omitted.
      const body = replyTo ? { text, reply_to: replyTo.id } : { to, text };
      const r = await api(`/api/w/instances/${id}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setOut(`✅ Terkirim: ${r.message_id}`);
      setText("");
      setReplyTo(null);
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
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900 relative overflow-hidden">
      {/* floating deco */}
      <div aria-hidden className="absolute top-20 left-[7%] w-10 h-10 bg-amber-300 border-2 border-slate-900 rounded-xl rotate-12 hidden sm:block" />
      <div aria-hidden className="absolute top-72 right-[6%] w-14 h-14 bg-violet-400 border-2 border-slate-900 rounded-full -rotate-12 hidden sm:block" />
      <div aria-hidden className="absolute bottom-32 left-[9%] font-hand text-2xl text-slate-400 rotate-3 hidden md:block">
        gas kirim~ 🚀
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 relative">
        <p className="mb-4">
          <Link href="/dashboard" className="font-display text-sm text-slate-400 hover:text-slate-800">← Nomorku</Link>
        </p>
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <h1 className="font-display font-bold text-3xl tracking-tight">
            <span className="bg-amber-400 px-3 rounded-2xl inline-block rotate-1 shadow-[4px_4px_0_#1e1b4b] font-mono">
              {id}
            </span>
          </h1>
          {status && (
            <Badge variant={status.logged_in ? "default" : "secondary"} className="rounded-full border border-slate-900 -rotate-2">
              {status.logged_in ? "✅ paired" : "⏳ belum pair"}
            </Badge>
          )}
        </div>

        {status && !status.logged_in && (
          <Card className="rounded-3xl border-2 border-slate-900 bg-amber-50 mb-4 shadow-[6px_6px_0_#1e1b4b] rotate-[0.5deg]">
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

        <div className="relative mb-4">
          <div className="absolute -top-3 right-4 z-10 bg-sky-300 border-2 border-slate-900 rounded-full px-3 py-1 font-display font-semibold text-sm -rotate-3 shadow-[3px_3px_0_#1e1b4b]">
            tes kirim! 💌
          </div>
          <Card className="rounded-3xl border-2 shadow-[6px_6px_0_#1e1b4b] rotate-[0.5deg]">
            <CardHeader><CardTitle className="font-display">Kirim pesan tes</CardTitle></CardHeader>
            <CardContent>
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 bg-violet-50 border-2 border-violet-600 rounded-xl px-3 py-1.5 text-sm">
                  <span>↩️ <span className="font-mono text-xs font-semibold">{replyTo.sender}</span>: {replyTo.snippet.slice(0, 60)}</span>
                  <button type="button" onClick={() => setReplyTo(null)}
                    className="ml-auto font-bold text-slate-400 hover:text-red-600">✕</button>
                </div>
              )}
              <form onSubmit={send} className="flex gap-2 flex-wrap">
                <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Ke: 628xx / nama kontak"
                  className="w-44 rounded-xl border-2" />
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan…"
                  className="flex-1 min-w-[160px] rounded-xl border-2" />
                <Button type="submit" className="rounded-full font-display bg-violet-600 hover:bg-violet-500 border-2 border-slate-900 shadow-[3px_3px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#1e1b4b] transition-all">Kirim</Button>
              </form>
              {out && <p className="text-xs text-slate-500 mt-2">{out}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-4">
          <div className="absolute -top-3 right-4 z-10 bg-amber-300 border-2 border-slate-900 rounded-full px-3 py-1 font-display font-semibold text-sm rotate-2 shadow-[3px_3px_0_#1e1b4b]">
            pantau webhook 🪝
          </div>
          <Card className="rounded-3xl border-2 shadow-[6px_6px_0_#1e1b4b] -rotate-[0.5deg]">
            <CardHeader><CardTitle className="font-display">Webhook</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveWebhook} className="flex gap-2">
                <Input value={webhook} onChange={(e) => setWebhook(e.target.value)}
                  placeholder="https://servermu/webhook (kosongkan = hapus)"
                  className="rounded-xl border-2" />
                <Button type="submit" variant="outline" className="rounded-full shrink-0 font-display border-2 border-slate-900 shadow-[3px_3px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#1e1b4b] transition-all">Simpan</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-2 shadow-[6px_6px_0_#1e1b4b] rotate-[0.5deg] hover:rotate-0 transition-transform">
          <CardHeader><CardTitle className="font-display">📨 Pesan terbaru</CardTitle></CardHeader>
          <CardContent>
            {msgs.length === 0 && <p className="text-sm text-slate-400">Belum ada. Coba kirim sesuatu ke nomor ini! 👆</p>}
            {msgs.map((m) => (
              <div key={m.id} className="py-2 border-b last:border-0 text-sm group">
                <span className="font-mono text-xs bg-amber-100 text-amber-900 rounded-full px-2 py-0.5 border border-slate-900">
                  {m.sender_pn || m.sender}
                </span>
                <button type="button" title="Balas pesan ini"
                  onClick={() => setReplyTo({
                    id: m.id,
                    sender: m.sender_pn || m.sender,
                    snippet: m.text || `[${m.media_kind || "non-text"}]`,
                  })}
                  className="ml-2 text-xs font-display text-violet-600 sm:opacity-0 sm:group-hover:opacity-100 hover:text-violet-400 transition-opacity">
                  ↩️ Balas
                </button>
                <p className="mt-1">
                  {m.text || <span className="italic text-slate-400">[{m.media_kind || "non-text"}]</span>}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Label className="text-xs text-slate-400">Butuh yang advance? Pakai API langsung 👇</Label>
          <pre className="text-xs bg-slate-900 text-emerald-200 rounded-2xl p-4 mt-2 overflow-x-auto border-2 border-slate-900 shadow-[4px_4px_0_#c026d3]">
            POST /api/v1/instances/{id}/messages/send{"\n"}
            GET  /api/v1/instances/{id}/messages?from=&limit=
          </pre>
        </div>

        <p className="font-hand text-2xl text-slate-400 text-center mt-8">
          zantai ya~ 🍃
        </p>
      </div>
    </main>
  );
}
