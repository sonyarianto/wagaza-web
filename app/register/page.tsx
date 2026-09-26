"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm rounded-3xl border-2 shadow-xl shadow-amber-100">
        <CardHeader className="text-center">
          <div className="text-3xl mb-1">🎈</div>
          <CardTitle className="text-2xl">Bikin akun yuk!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com" type="email" required className="rounded-xl mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 8 karakter" type="password" required minLength={8} className="rounded-xl mt-1" />
            </div>
            {err && <p className="text-sm text-red-500">{err}</p>}
            <Button className="w-full rounded-full">Daftar 🚀</Button>
          </form>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Sudah punya akun? <Link href="/login" className="text-emerald-600 font-medium">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
