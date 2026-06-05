import { Skull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroStats, heroSubStats, heroModes } from "@/lib/data"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:pt-20">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-gold">
          <Skull className="h-9 w-9" strokeWidth={2.5} />
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="text-primary">● Live on Solana</span>
          <span className="text-border">/</span>
          <span>Real Graded Slabs</span>
          <span className="text-border">/</span>
          <span>Settled in SOL</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
          Graded One Piece cards, wagered on-chain.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Pay an entry to spin for a real PSA- or CGC-graded slab, or wager your own slab against another
          pirate. Winner takes the card — settled in SOL on Solana, instantly.
        </p>

        {/* primary stat row */}
        <div className="mx-auto mt-9 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {heroStats.map((s) => (
            <div key={s.label} className="border-r border-border px-3 py-5 last:border-r-0">
              <div className={`font-heading text-xl font-extrabold sm:text-2xl ${s.accent ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* mode pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {heroModes.map((m, i) => (
            <span
              key={m}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {m}
            </span>
          ))}
        </div>

        <div className="mt-7">
          <Button size="lg" className="rounded-full px-8 text-base">
            Enter the Battle →
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">$10 standard · avg $18 · $25 premium · avg $22</p>
        </div>

        {/* sub stat row */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3">
          {heroSubStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-secondary px-3 py-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-heading text-2xl font-extrabold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
