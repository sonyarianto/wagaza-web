"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<"busy" | "ok" | "bad">("busy");
  const [email, setEmail] = useState("");
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token") || "";
    if (!token) {
      setState("bad");
      return;
    }
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        setState("ok");
        setTimeout(() => router.push("/dashboard"), 1500);
      })
      .catch(() => setState("bad"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setResent(true);
  }

  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border-2 border-slate-900 rounded-3xl p-6 pt-8 shadow-[8px_8px_0_#1e1b4b] text-center">
        {state === "busy" && (
          <>
            <div className="text-4xl mb-2">⏳</div>
            <h1 className="font-display font-bold text-2xl">Verifikasi…</h1>
          </>
        )}
        {state === "ok" && (
          <>
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="font-display font-bold text-2xl">Email verified!</h1>
            <p className="text-sm text-slate-500 mt-2">Mengalihkan ke dashboard…</p>
          </>
        )}
        {state === "bad" && (
          <>
            <div className="text-4xl mb-2">🥲</div>
            <h1 className="font-display font-bold text-2xl">Link tidak valid</h1>
            <p className="text-sm text-slate-500 mt-2 mb-4">
              Mungkin sudah dipakai atau kedaluwarsa. Minta link baru:
            </p>
            {resent ? (
              <p className="text-sm text-emerald-600 font-semibold">
                ✅ Kalau emailmu terdaftar, link baru meluncur!
              </p>
            ) : (
              <form onSubmit={resend} className="flex gap-2">
                <input
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com" type="email" required
                  className="flex-1 min-w-0 bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-sm outline-none"
                />
                <button className="bg-amber-300 border-2 border-slate-900 rounded-full px-4 py-2 text-sm font-display font-semibold shadow-[3px_3px_0_#1e1b4b]">
                  Kirim
                </button>
              </form>
            )}
            <p className="mt-4">
              <Link href="/" className="font-display text-sm text-slate-400 hover:text-slate-800">
                ← Wagaza<span className="text-fuchsia-600">*</span>
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function Verify() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
