import { Swords } from "lucide-react"
import { arenaStats, cadenceTiers } from "@/lib/arena"

export function ArenaHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center sm:pt-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-gold">
          <Swords className="h-7 w-7" strokeWidth={2.5} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="text-primary">● Live battles</span>
          <span className="text-border">/</span>
          <span>Random holder draw</span>
          <span className="text-border">/</span>
          <span>Auto-airdropped</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          The Live Arena
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Every battle, two random slab-holders are drawn from a verifiable on-chain snapshot. Their pirates
          clash in a live duel, and the winner is automatically airdropped a real graded grail from the treasury.
        </p>

        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {arenaStats.map((s) => (
            <div key={s.label} className="border-r border-border px-3 py-5 last:border-r-0">
              <div className={`font-heading text-2xl font-extrabold ${s.accent ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-foreground">Cadence scales with volume:</span>
          {cadenceTiers.map((t) => (
            <span key={t.volume} className="rounded-full border border-border bg-secondary px-3 py-1">
              {t.volume} → <span className="font-semibold text-foreground">{t.cadence}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
