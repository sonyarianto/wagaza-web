"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
      const m = await api(`/api/w/instances/${id}/messages?limit=20`);
      setMsgs(m);
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
      setOut(`Sent: ${r.message_id}`);
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
      setOut("Webhook saved.");
    } catch (e) {
      setOut(e instanceof Error ? e.message : "failed");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="mb-4">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">← My numbers</Link>
        </p>
        <h1 className="text-xl font-bold font-mono mb-1">{id}</h1>
        <p className="text-sm text-slate-400 mb-6">
          {status
            ? `${status.logged_in ? "paired" : "not paired"} · ${status.connected ? "connected" : "offline"}`
            : "loading…"}
        </p>

        {status && !status.logged_in && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 text-center">
            <h2 className="font-semibold mb-2">Pair this number</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/w/instances/${id}/session/qr.svg?t=${qrTick}`} alt="Scan to pair"
              className="mx-auto bg-white p-3 rounded-xl w-64 h-64" />
            <p className="text-xs text-slate-400 mt-2">
              WhatsApp → Linked Devices → Link a Device
              {pairCode && (
                <> · or enter pair-code <span className="font-mono text-lg font-bold tracking-widest">{pairCode}</span></>
              )}
            </p>
          </section>
        )}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
          <h2 className="font-semibold mb-2">Send test message</h2>
          <form onSubmit={send} className="flex gap-2 flex-wrap">
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To: 628xx"
              className="w-44 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text"
              className="flex-1 min-w-[160px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            <button className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 text-sm font-medium">Send</button>
          </form>
          {out && <p className="text-xs text-slate-400 mt-2">{out}</p>}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
          <h2 className="font-semibold mb-2">Webhook</h2>
          <form onSubmit={saveWebhook} className="flex gap-2">
            <input value={webhook} onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://your-server/webhook (empty = clear)"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            <button className="border border-slate-700 hover:border-slate-500 rounded-lg px-4 py-2 text-sm">Set</button>
          </form>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-2">Recent messages</h2>
          {msgs.length === 0 && <p className="text-sm text-slate-500">Nothing yet.</p>}
          {msgs.map((m) => (
            <div key={m.id} className="py-2 border-b border-slate-800 last:border-0 text-sm">
              <span className="font-mono text-slate-400">{m.sender_pn || m.sender}</span>
              <p className="text-slate-200">
                {m.text || <span className="italic text-slate-500">[{m.media_kind || "non-text"}]</span>}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
