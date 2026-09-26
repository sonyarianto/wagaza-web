"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const b = await r.json().catch(() => ({}));
      setErr(b.error || "login failed");
      return;
    }
    router.push(next.startsWith("/") ? next : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* floating deco */}
      <div aria-hidden className="absolute top-10 left-[8%] w-14 h-14 bg-fuchsia-400 border-2 border-slate-900 rounded-2xl rotate-12 hidden sm:block" />
      <div aria-hidden className="absolute bottom-16 right-[10%] w-10 h-10 bg-sky-300 border-2 border-slate-900 rounded-full hidden sm:block" />
      <div aria-hidden className="absolute top-1/3 right-[6%] font-hand text-2xl text-slate-400 rotate-6 hidden md:block">
        gas login~ 🚀
      </div>

      <div className="w-full max-w-sm relative">
        <div className="absolute -top-4 -right-3 z-10 bg-amber-300 border-2 border-slate-900 rounded-full px-3 py-1 font-display font-semibold text-sm rotate-6 shadow-[3px_3px_0_#1e1b4b]">
          yuk masuk! 👋
        </div>
        <form
          onSubmit={submit}
          className="bg-white border-2 border-slate-900 rounded-3xl p-6 pt-8 shadow-[8px_8px_0_#1e1b4b] -rotate-1"
        >
          <h1 className="font-display font-bold text-3xl mb-1">Halo lagi!</h1>
          <p className="text-sm text-slate-500 mb-5">
            Nomor-nomormu kangen nih. <span className="font-hand text-lg text-slate-700">beneran!</span>
          </p>
          <div className="mb-3">
            <Label htmlFor="email" className="font-display">Email</Label>
            <Input
              id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com" type="email" required
              className="rounded-xl mt-1 border-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="font-display">Password</Label>
            <Input
              id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" type="password" required
              className="rounded-xl mt-1 border-2"
            />
          </div>
          {err && (
            <p className="text-sm font-semibold text-red-600 bg-red-50 border-2 border-red-600 rounded-xl px-3 py-2 mb-3">
              ⚠️ {err}
            </p>
          )}
          <Button className="w-full rounded-full font-display text-lg bg-violet-600 hover:bg-violet-500 border-2 border-slate-900 shadow-[4px_4px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1e1b4b] transition-all">
            Masuk 🎉
          </Button>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="text-fuchsia-600 font-semibold underline underline-offset-4">
              Daftar sini!
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

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
