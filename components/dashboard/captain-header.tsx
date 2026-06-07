import { Anchor, Wallet } from "lucide-react"
import { captain, captainStats } from "@/lib/data"

export function CaptainHeader() {
  return (
    <section className="relative overflow-hidden border-b-2 border-gold/40">
      {/* Crew battle backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-crew.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pt-16">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl border-2 border-gold bg-primary text-primary-foreground shadow-xl">
            <Anchor className="h-9 w-9" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold-foreground">
                {captain.rank}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{captain.wallet}</span>
            </div>
            <h1 className="mt-2 font-display text-4xl uppercase leading-none text-foreground text-shadow-poster sm:text-5xl">
              {captain.handle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{captain.joined}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-gold/40 bg-card/80 px-6 py-4 backdrop-blur sm:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Win Rate</span>
            <span className="font-display text-2xl text-gold">{captain.winRate}%</span>
            <button className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:opacity-90">
              <Wallet className="h-3.5 w-3.5" /> Connected
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {captainStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/30 bg-card/80 p-5 text-center shadow-sm backdrop-blur sm:text-left"
            >
              <div className={`font-display text-2xl ${s.accent ? "text-gold" : "text-foreground"}`}>{s.value}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-foreground">{s.label}</div>
              <div className="text-[10px] text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
