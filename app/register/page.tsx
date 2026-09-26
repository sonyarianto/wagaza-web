"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        setErr(b.error || "register failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setErr("tidak bisa hubungi server — cek koneksimu lalu coba lagi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* floating deco */}
      <div aria-hidden className="absolute top-12 right-[9%] w-16 h-16 bg-amber-300 border-2 border-slate-900 rounded-full hidden sm:block" />
      <div aria-hidden className="absolute bottom-20 left-[7%] w-12 h-12 bg-violet-400 border-2 border-slate-900 rounded-2xl -rotate-12 hidden sm:block" />
      <div aria-hidden className="absolute top-1/4 left-[5%] font-hand text-2xl text-slate-400 -rotate-6 hidden md:block">
        gratis kok~ 🎈
      </div>

      <div className="w-full max-w-sm relative">
        <div className="absolute -top-4 -left-3 z-10 bg-fuchsia-400 text-white border-2 border-slate-900 rounded-full px-3 py-1 font-display font-semibold text-sm -rotate-6 shadow-[3px_3px_0_#1e1b4b]">
          baru di sini? ✨
        </div>
        <form
          onSubmit={submit}
          className="bg-white border-2 border-slate-900 rounded-3xl p-6 pt-8 shadow-[8px_8px_0_#1e1b4b] rotate-1"
        >
          <h1 className="font-display font-bold text-3xl mb-1">Bikin akun yuk!</h1>
          <p className="text-sm text-slate-500 mb-5">
            30 detik doang. <span className="font-hand text-lg text-slate-700">sumpah!</span>
          </p>
          <div className="mb-3">
            <Label htmlFor="email" className="font-display">Email</Label>
            <Input
              id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com" type="email" required
              className="rounded-xl mt-1 border-2"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="password" className="font-display">Password</Label>
            <Input
              id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 8 karakter" type="password" required minLength={8}
              className="rounded-xl mt-1 border-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password2" className="font-display">Ulangi password</Label>
            <Input
              id="password2" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="sama kayak di atas ya" type="password" required minLength={8}
              className="rounded-xl mt-1 border-2"
            />
          </div>
            <Label htmlFor="password" className="font-display">Password</Label>
            <Input
              id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="min. 8 karakter" type="password" required minLength={8}
              className="rounded-xl mt-1 border-2"
            />
          </div>
          {err && (
            <p className="text-sm font-semibold text-red-600 bg-red-50 border-2 border-red-600 rounded-xl px-3 py-2 mb-3">
              ⚠️ {err}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full rounded-full font-display text-lg bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1e1b4b] transition-all disabled:opacity-60">
            {busy ? "Mengirim… ⏳" : "Daftar 🚀"}
          </Button>
          <noscript>
            <p className="text-sm font-semibold text-red-600 mt-3">
              Halaman ini butuh JavaScript aktif untuk daftar.
            </p>
          </noscript>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-fuchsia-600 font-semibold underline underline-offset-4">
              Masuk
            </Link>
          </p>
        </form>
        <p className="text-center mt-5">
          <Link href="/" className="font-display text-sm text-slate-400 hover:text-slate-800">
            ← Wagaza<span className="text-fuchsia-600">*</span>
          </Link>
        </p>
      </div>
    </main>
  );
}
