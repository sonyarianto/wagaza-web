import Link from "next/link";

const TICKER = ["KIRIM PESAN", "TERIMA WEBHOOK", "MULTI NOMOR", "TANPA AUTO-REPLY", "QR PAIRING", "API DOCS"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF6E9] text-slate-900 overflow-x-clip">
      {/* nav */}
      <nav className="max-w-5xl mx-auto px-4 pt-5 flex items-center gap-2">
        <span className="font-display font-bold text-2xl tracking-tight">
          wagaza<span className="text-fuchsia-600">*</span>
        </span>
        <div className="ml-auto flex gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold border-2 border-slate-900 rounded-full bg-white hover:bg-amber-200 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/docs"
            className="px-4 py-2 text-sm font-semibold hover:underline underline-offset-4"
          >
            Docs
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center relative">
        <span className="font-hand text-2xl text-fuchsia-600 -rotate-3 inline-block mb-2">
          halo, ini gateway WhatsApp yang santai~ 👋
        </span>
        <h1 className="font-display font-bold leading-[0.95] tracking-tight text-6xl sm:text-8xl">
          SATU SERVER,
          <br />
          <span className="bg-violet-600 text-white px-4 rounded-2xl inline-block -rotate-1 shadow-[6px_6px_0_#1e1b4b]">
            BANYAK NOMOR.
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto">
          Daftarkan nomor WhatsApp-mu, scan sekali, terus terima webhook dan
          balas via API. <span className="font-hand text-xl text-slate-800">tanpa drama.</span>
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link
            href="/register"
            className="font-display font-semibold text-lg px-8 py-3 rounded-full bg-amber-400 border-2 border-slate-900 shadow-[5px_5px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#1e1b4b] transition-all"
          >
            Daftar gratis →
          </Link>
          <Link
            href="/docs"
            className="font-display font-semibold text-lg px-8 py-3 rounded-full bg-white border-2 border-slate-900 shadow-[5px_5px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#1e1b4b] transition-all"
          >
            Lihat API
          </Link>
        </div>
      </section>

      {/* marquee */}
      <div className="border-y-2 border-slate-900 bg-fuchsia-500 text-white py-2.5 -rotate-1 scale-[1.02] overflow-hidden">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((half) => (
            <div key={half} aria-hidden={half === 1} className="flex gap-8 pr-8">
              {TICKER.map((t) => (
                <span key={t} className="font-display font-semibold text-lg whitespace-nowrap">
                  {t} <span className="text-amber-300">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* steps */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-8 text-center">
          Caranya? <span className="font-hand font-semibold text-violet-600">gampang banget</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            ["01", "Daftar + approve", "Tulis nomormu, operator approve, dapat link klaim sekali pakai.", "bg-sky-200", "-rotate-1"],
            ["02", "Scan QR", "Buka WhatsApp → Perangkat Tertaut → scan. Sekali doang!", "bg-amber-200", "rotate-1"],
            ["03", "Terima & balas", "Webhook masuk ke servermu, balas via API. Beres!", "bg-pink-200", "-rotate-1"],
          ].map(([n, title, desc, bg, tilt]) => (
            <div
              key={n}
              className={`${bg} ${tilt} border-2 border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0_#1e1b4b] hover:rotate-0 transition-transform`}
            >
              <div className="font-display font-bold text-5xl text-slate-900/15">{n}</div>
              <h3 className="font-display font-semibold text-xl -mt-3 mb-1">{title}</h3>
              <p className="text-sm text-slate-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* feature strip */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="border-2 border-slate-900 rounded-2xl bg-slate-900 text-white p-6 sm:p-8 shadow-[8px_8px_0_#c026d3]">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-display text-lg">
            {["🤫 silent by design", "🖼️ kirim & terima file", "🔑 API key per nomor", "🪝 webhook + retry", "📊 dashboard santai"].map(
              (f) => (
                <span key={f}>{f}</span>
              )
            )}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="text-center pb-20 px-4">
        <p className="font-hand text-3xl text-slate-700 mb-4">yuk mulai, gratis kok~</p>
        <Link
          href="/register"
          className="inline-block font-display font-semibold text-xl px-10 py-4 rounded-full bg-violet-600 text-white border-2 border-slate-900 shadow-[6px_6px_0_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#1e1b4b] transition-all"
        >
          Bikin akun Wagaza
        </Link>
      </section>

      <footer className="border-t-2 border-slate-900 py-5 text-center text-sm text-slate-500">
        wagaza<span className="text-fuchsia-600">*</span> — gateway WhatsApp tanpa drama ·{" "}
        <Link href="/docs" className="underline underline-offset-4 hover:text-slate-800">
          docs
        </Link>
      </footer>
    </main>
  );
}
