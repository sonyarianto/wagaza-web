# Wagaza (web)

Public website for Wagaza (Next.js, stateless). All state lives in the Wagaza
gateway — this app is a thin backend-for-frontend over its API.

Configure via env: `WAGAZA_API_URL` + `WAGAZA_API_KEY` (server-side only,
never `NEXT_PUBLIC_*`). The browser holds just the `wgz` session cookie
(httpOnly).

## Pages

- `/` landing, `/login`, `/register`
- `/dashboard` — my numbers, register-a-number, per-number detail
  (pairing QR, send test, webhook, recent messages)
- `/docs` — API reference
