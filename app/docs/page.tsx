import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROWS: [string, string, string][] = [
  ["POST", "/api/v1/auth/register", "Bikin akun {email, password}"],
  ["POST", "/api/v1/auth/login", "Masuk, dapat session token"],
  ["POST", "/api/v1/registrations", "Minta instance gateway {phone}"],
  ["GET", "/api/v1/me/instances", "Nomor-nomor milikmu (session)"],
  ["GET", "/api/v1/instances/{id}/status", "connected, logged_in, uptime"],
  ["GET", "/api/v1/instances/{id}/session/qr", "QR + pair-code"],
  ["GET", "/api/v1/instances/{id}/session/qr.svg", "Gambar QR siap scan"],
  ["POST", "/api/v1/instances/{id}/session/pair", "Minta pair-code"],
  ["POST", "/api/v1/instances/{id}/messages/send", "Kirim teks {to, text}"],
  ["POST", "/api/v1/instances/{id}/messages/send-media", "Kirim file (multipart)"],
  ["GET", "/api/v1/instances/{id}/messages?from=&limit=", "Log pesan masuk"],
  ["GET", "/api/v1/instances/{id}/messages/{row}/media", "Download lampiran"],
  ["POST", "/api/v1/instances/{id}/webhook", "Set webhook {url}"],
  ["GET", "/api/v1/instances/{id}/users", "Daftar pengirim terdaftar"],
  ["POST", "/api/v1/instances/{id}/users/register", "Daftarkan pengirim {phone}"],
];

export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="mb-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-emerald-600">← Home</Link>
        </p>
        <h1 className="text-3xl font-extrabold mb-2">📖 API docs</h1>
        <p className="text-sm text-slate-500 mb-6">
          Di website ini pakai cookie session. Kalau panggil gateway langsung,
          pakai header <code className="font-mono bg-amber-100 rounded px-1">Authorization: Bearer</code> (master atau scoped key).
        </p>
        <Card className="rounded-3xl border-2">
          <CardContent className="p-2">
            {ROWS.map(([m, p, d]) => (
              <div key={p} className="py-2.5 px-3 border-b last:border-0 text-sm">
                <Badge className="mr-2 rounded-full font-mono">{m}</Badge>
                <code className="font-mono break-all">{p}</code>
                <p className="text-slate-500 mt-0.5 ml-1">{d}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/60 mt-4">
          <CardHeader><CardTitle>🔔 Kontrak webhook</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1">
            <p>• Maksimal 3x kirim (langsung, +2s, +10s); sukses = HTTP 2xx.</p>
            <p>• Dedupe pakai <code className="font-mono">(instance, message_id)</code>.</p>
            <p>• Ditandatangani <code className="font-mono">x-wagaza-signature</code> (HMAC-SHA256) kalau dikonfigurasi.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
