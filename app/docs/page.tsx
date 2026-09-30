import Link from "next/link";

const CUSTOMER_ROWS: [string, string, string][] = [
  ["POST", "/api/v1/instances/{id}/messages/send", "Kirim teks {to, text, reply_to?} — reply pakai id baris"],
  ["POST", "/api/v1/instances/{id}/messages/send-media", "Kirim file (multipart)"],
  ["GET", "/api/v1/instances/{id}/status", "Cek nomormu konek atau tidak"],
  ["GET", "/api/v1/instances/{id}/messages?from=&limit=", "Ambil pesan yang ketinggalan"],
  ["GET", "/api/v1/instances/{id}/contacts", "Buku alamat: nama → nomor"],
  ["POST", "/api/v1/instances/{id}/contacts", "Simpan kontak {name, phone}"],
  ["DELETE", "/api/v1/instances/{id}/contacts/{name}", "Hapus kontak"],
];

const OPERATOR_ROWS: [string, string, string][] = [
  ["POST", "/api/v1/auth/register", "Bikin akun {email, password}"],
  ["POST", "/api/v1/auth/login", "Masuk, dapat session token"],
  ["POST", "/api/v1/registrations", "Minta instance gateway {phone}"],
  ["GET", "/api/v1/me/instances", "Nomor-nomor milikmu (session)"],
  ["GET", "/api/v1/instances/{id}/session/qr", "QR + pair-code"],
  ["GET", "/api/v1/instances/{id}/session/qr.svg", "Gambar QR siap scan"],
  ["POST", "/api/v1/instances/{id}/session/pair", "Minta pair-code"],
  ["GET", "/api/v1/instances/{id}/messages/{row}/media", "Download lampiran"],
  ["DELETE", "/api/v1/instances/{id}/messages/{row}", "Hapus satu pesan tersimpan"],
  ["GET", "/api/v1/instances/{id}/webhook", "Lihat webhook terpasang"],
  ["POST", "/api/v1/instances/{id}/webhook", "Set webhook {url}"],
  ["GET", "/api/v1/instances/{id}/users", "Daftar pengirim terdaftar"],
  ["POST", "/api/v1/instances/{id}/users/register", "Daftarkan pengirim {phone}"],
];

const METHOD_STYLE: Record<string, string> = {
  GET: "bg-sky-300",
  POST: "bg-violet-500 text-white",
  DELETE: "bg-red-400 text-white",
};

export default function Docs() {
  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="mb-4">
          <Link href="/" className="font-display text-sm text-slate-500 hover:text-slate-900">
            ← Wagaza
          </Link>
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl mb-2">
          📖 API <span className="bg-amber-300 px-3 rounded-2xl inline-block rotate-1 border-2 border-slate-900 shadow-[4px_4px_0_#1e1b4b]">docs</span>
        </h1>
        <p className="text-sm text-slate-500 mb-6 max-w-xl">
          Di website ini pakai cookie session. Kalau panggil gateway langsung,
          pakai header <code className="font-mono bg-white border border-slate-300 rounded px-1">Authorization: Bearer</code> (master
          atau scoped key).
        </p>
        <h2 className="font-display font-bold text-2xl mb-1 mt-2">Buat customer 🤝</h2>
        <p className="text-sm text-slate-500 mb-4">
          Ini saja yang dipakai harian: terima webhook, balas via API.
        </p>
        <div className="space-y-2.5">
          {CUSTOMER_ROWS.map(([m, p, d]) => (
            <div
              key={p}
              className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-3 shadow-[4px_4px_0_#1e1b4b] hover:-translate-y-0.5 transition-transform"
            >
              <span
                className={`inline-block font-mono text-xs font-bold rounded-full px-2.5 py-0.5 mr-2 border border-slate-900 ${METHOD_STYLE[m] || "bg-slate-200"}`}
              >
                {m}
              </span>
              <code className="font-mono text-sm break-all">{p}</code>
              <p className="text-sm text-slate-500 mt-1 ml-1">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="font-display font-bold text-2xl mb-1 mt-8">Buat operator 🛠️</h2>
        <p className="text-sm text-slate-500 mb-4">
          Setup, pairing, dan insiden — bukan urusan harian customer.
        </p>
        <div className="space-y-2.5">
          {OPERATOR_ROWS.map(([m, p, d]) => (
            <div
              key={p}
              className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-3 shadow-[4px_4px_0_#1e1b4b] hover:-translate-y-0.5 transition-transform"
            >
              <span
                className={`inline-block font-mono text-xs font-bold rounded-full px-2.5 py-0.5 mr-2 border border-slate-900 ${METHOD_STYLE[m] || "bg-slate-200"}`}
              >
                {m}
              </span>
              <code className="font-mono text-sm break-all">{p}</code>
              <p className="text-sm text-slate-500 mt-1 ml-1">{d}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 text-white border-2 border-slate-900 rounded-2xl p-5 mt-6 shadow-[6px_6px_0_#c026d3]">
          <h2 className="font-display font-semibold text-xl mb-2">🔔 Kontrak webhook</h2>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Maksimal 3x kirim (langsung, +2s, +10s); sukses = HTTP 2xx.</li>
            <li>• Dedupe pakai <code className="font-mono text-amber-300">(instance, message_id)</code>.</li>
            <li>• Ditandatangani <code className="font-mono text-amber-300">x-wagaza-signature</code> (HMAC-SHA256) kalau dikonfigurasi.</li>
          </ul>
        </div>
        <p className="font-hand text-2xl text-slate-400 text-center mt-8">
          selamat ngoprek~ ☕
        </p>
      </div>
    </main>
  );
}
