import Link from "next/link";

const ROWS: [string, string, string][] = [
  ["POST", "/api/v1/auth/register", "Create account {email, password}"],
  ["POST", "/api/v1/auth/login", "Log in, get session token"],
  ["POST", "/api/v1/registrations", "Request a gateway instance {phone}"],
  ["GET", "/api/v1/me/instances", "Instances owned by you (session)"],
  ["GET", "/api/v1/instances/{id}/status", "connected, logged_in, uptime"],
  ["GET", "/api/v1/instances/{id}/session/qr", "QR payload + pair-code"],
  ["GET", "/api/v1/instances/{id}/session/qr.svg", "Scannable QR image"],
  ["POST", "/api/v1/instances/{id}/session/pair", "Request pair-code"],
  ["POST", "/api/v1/instances/{id}/messages/send", "Send text {to, text}"],
  ["POST", "/api/v1/instances/{id}/messages/send-media", "Send file (multipart)"],
  ["GET", "/api/v1/instances/{id}/messages?from=&limit=", "Inbound log, newest first"],
  ["GET", "/api/v1/instances/{id}/messages/{row}/media", "Download attachment"],
  ["POST", "/api/v1/instances/{id}/webhook", "Set webhook {url}"],
  ["GET", "/api/v1/instances/{id}/users", "List registered senders"],
  ["POST", "/api/v1/instances/{id}/users/register", "Register sender {phone}"],
];

export default function Docs() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="mb-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-white">← Home</Link>
        </p>
        <h1 className="text-2xl font-bold mb-2">API docs</h1>
        <p className="text-sm text-slate-400 mb-6">
          Base URL is your Waga server. Auth: website session cookie on this
          site, or <code className="font-mono">Authorization: Bearer</code> (master
          or per-instance key) when calling the gateway directly.
        </p>
        <table className="w-full text-sm">
          <tbody>
            {ROWS.map(([m, p, d]) => (
              <tr key={p} className="border-b border-slate-800 last:border-0">
                <td className="py-2 pr-3 font-mono text-emerald-300 whitespace-nowrap">{m}</td>
                <td className="py-2 pr-3 font-mono break-all">{p}</td>
                <td className="py-2 text-slate-400">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-lg font-semibold mt-8 mb-2">Webhook contract</h2>
        <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
          <li>Up to 3 deliveries (immediate, +2s, +10s); success means HTTP 2xx.</li>
          <li>Dedupe on <code className="font-mono">(instance, message_id)</code>.</li>
          <li>Signed with <code className="font-mono">x-waga-signature</code> (HMAC-SHA256) when configured.</li>
        </ul>
      </div>
    </main>
  );
}
