import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-white text-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-amber-300 text-amber-950 hover:bg-amber-300 rounded-full px-4 py-1">
          ✨ WhatsApp gateway yang santai
        </Badge>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-emerald-200 rotate-3">
          💬
        </div>
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Wa<span className="text-emerald-600">ga</span>
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Silent WhatsApp gateway buat nomormu.
          <br />
          Pesan masuk tercatat &amp; diteruskan — tanpa auto-reply berisik.
        </p>
        <div className="flex gap-3 justify-center mb-12">
          <Link href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 h-11 text-base font-medium bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-500">
            Daftar gratis
          </Link>
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 h-11 text-base font-medium border border-slate-300 bg-white hover:border-emerald-400">
            Masuk
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 text-left">
          {[
            ["📝", "Daftarkan nomormu dan tunggu approve sebentar."],
            ["📱", "Scan QR pairing dari WhatsApp kamu."],
            ["🚀", "Terima webhook, balas via API. Gampang!"],
          ].map(([emoji, t]) => (
            <Card key={t} className="rounded-3xl border-2 shadow-sm">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">{emoji}</div>
                <p className="text-sm text-slate-600">{t}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/docs" className="text-sm text-slate-400 hover:text-emerald-600">
            📖 API docs →
          </Link>
        </p>
      </div>
    </main>
  );
}
