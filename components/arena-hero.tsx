import { Swords, MapPin, Clock } from "lucide-react"
import { arenaStats } from "@/lib/arena"

export function ArenaHero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-gold/40">
      {/* Coliseum stadium backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-coliseum.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-12 text-center sm:pt-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-gold">
          <Swords className="h-7 w-7" strokeWidth={2.5} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" /> Live battles
          </span>
          <span className="text-border">/</span>
          <span>Random holder draw</span>
          <span className="text-border">/</span>
          <span>Auto-airdropped</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-balance font-display text-5xl uppercase leading-[0.92] text-foreground text-shadow-poster sm:text-7xl">
          The Colosseum
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Every battle, two random slab-holders are drawn from a verifiable on-chain snapshot. Their pirates
          clash in a live duel, and the winner is automatically airdropped a real graded grail from the treasury.
        </p>

        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-gold/40 bg-card/80 shadow-lg backdrop-blur">
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

        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-card/80 p-4 text-left shadow-lg backdrop-blur">
            <MapPin className="h-6 w-6 shrink-0 text-gold" strokeWidth={2.5} />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold">Where</div>
              <div className="font-heading text-sm font-extrabold text-foreground">
                The Colosseum, live on Solana
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-card/80 p-4 text-left shadow-lg backdrop-blur">
            <Clock className="h-6 w-6 shrink-0 text-primary" strokeWidth={2.5} />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">When</div>
              <div className="font-heading text-sm font-extrabold text-foreground">
                Every 15–60 min, around the clock
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
