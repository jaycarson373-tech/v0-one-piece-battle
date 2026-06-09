import { Swords, Plus, Check, Loader2 } from "lucide-react"
import { liveDuels, duelTiers, duelFlow, type DuelStatus } from "@/lib/kotp"

const accentMap = {
  ocean: "border-ocean/60 text-ocean",
  primary: "border-primary/60 text-primary",
  gold: "border-gold/60 text-gold",
}

function StatusBadge({ status }: { status: DuelStatus }) {
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
        <span className="live-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary" /> Live
      </span>
    )
  if (status === "open")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
        Open
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      Settled
    </span>
  )
}

export function LiveDuelArena() {
  return (
    <section id="arena" className="relative overflow-hidden border-b border-border">
      {/* fleet backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bg/fleet.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Swords className="h-4 w-4" /> Live Duel Arena
        </div>
        <h2 className="max-w-3xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
          Pick your stake. Lock the duel.
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Pick your stake, lock the duel, and wait for an opponent. Once accepted, the battle resolves through
          verifiable randomness and the winner takes the prize pool.
        </p>

        {/* duel tiers */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {duelTiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
                t.soon ? "border-dashed border-gold/40" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-display text-2xl uppercase ${accentMap[t.accent]}`}>{t.name}</span>
                {t.soon && (
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.tagline}</p>
              {!t.soon && (
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Winner takes</span>
                  <span className="font-heading text-lg font-extrabold text-foreground">${t.pool}</span>
                </div>
              )}
              <button
                disabled={t.soon}
                className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  t.soon
                    ? "cursor-not-allowed bg-secondary text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {t.soon ? "Coming soon" : (<><Plus className="h-4 w-4" /> Create Duel</>)}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* open + live duels */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-heading text-base font-extrabold text-foreground">Open & Live Duels</h3>
              <span className="font-mono text-xs text-muted-foreground">{liveDuels.length} rounds</span>
            </div>
            <ul className="divide-y divide-border">
              {liveDuels.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                  <StatusBadge status={d.status} />
                  <div className="ml-auto flex items-center gap-3 text-right">
                    <div className="hidden font-mono text-xs text-muted-foreground sm:block">
                      {d.challenger} vs {d.opponent ?? "—"}
                    </div>
                    <span className="font-heading text-sm font-extrabold text-foreground">${d.pool}</span>
                    {d.status === "open" ? (
                      <button className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground hover:opacity-90">
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                    ) : d.status === "live" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/50 px-3 py-1 text-xs font-bold text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Resolving
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-ocean">won</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* duel flow */}
          <div className="rounded-2xl border border-border bg-secondary p-6">
            <h3 className="font-heading text-base font-extrabold text-foreground">Duel Flow</h3>
            <ol className="mt-4 space-y-3">
              {duelFlow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-primary/40 bg-card font-mono text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
