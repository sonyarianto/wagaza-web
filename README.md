# waga-web

Public website for Wagaza (Next.js, stateless). All state lives in the Wagaza
gateway — this app is a thin backend-for-frontend over its API.

## Run

```bash
cp .env.example .env.local   # set WAGAZA_API_URL + WAGAZA_API_KEY
npm install
npm run dev
```

`WAGAZA_API_KEY` is server-side only (API routes). The browser holds just the
`wgs` session cookie (httpOnly).

## Pages

- `/` landing, `/login`, `/register`
- `/dashboard` — my numbers, register-a-number, per-number detail
  (pairing QR, send test, webhook, recent messages)
- `/docs` — API reference
