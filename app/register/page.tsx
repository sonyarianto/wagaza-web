"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
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
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold mb-4">Create Waga account</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required
          className="w-full mb-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8)" type="password" required minLength={8}
          className="w-full mb-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        {err && <p className="text-sm text-red-400 mb-3">{err}</p>}
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 text-sm font-medium">
          Register
        </button>
        <p className="text-sm text-slate-400 mt-3 text-center">
          Have an account? <Link href="/login" className="text-emerald-300">Login</Link>
        </p>
      </form>
    </main>
  );
}
