import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mx-auto mb-5">
          💬
        </div>
        <h1 className="text-4xl font-bold mb-3">Waga</h1>
        <p className="text-slate-400 mb-8">
          Silent WhatsApp gateway for your business number.
          <br />
          Inbound logged and forwarded — no spammy auto-replies.
        </p>
        <div className="flex gap-3 justify-center mb-12">
          <Link href="/register" className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-6 py-2.5 font-medium">
            Register
          </Link>
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 rounded-lg px-6 py-2.5">
            Login
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 text-left">
          {[
            ["1", "Register your number and get approved."],
            ["2", "Scan the pairing QR from WhatsApp."],
            ["3", "Receive webhooks, reply via API."],
          ].map(([n, t]) => (
            <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-emerald-400 font-bold mb-1">{n}</div>
              <p className="text-sm text-slate-300">{t}</p>
            </div>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/docs" className="text-sm text-slate-500 hover:text-slate-300">
            API docs →
          </Link>
        </p>
      </div>
    </main>
  );
}
