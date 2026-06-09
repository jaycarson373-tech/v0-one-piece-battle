import { Gift, Ticket } from "lucide-react"
import { airdropStats, airdropFlow } from "@/lib/kotp"

export function HolderAirdrops() {
  return (
    <section id="airdrops" className="relative overflow-hidden border-b border-border">
      {/* coast backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bg/coast.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-bottom opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/94 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Gift className="h-4 w-4" /> Holder Card Airdrops
        </div>
        <h2 className="max-w-3xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
          Hold tokens. Win real cards.
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every 30–60 minutes, the system selects a random holder and a random card from the vault. Holder odds
          are supply-weighted: every 100K tokens equals one ticket.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* airdrop flow */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-gold" />
              <h3 className="font-heading text-base font-extrabold text-foreground">Airdrop Flow</h3>
            </div>
            <ol className="mt-5 space-y-3">
              {airdropFlow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-gold/40 bg-secondary font-mono text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* airdrop stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {airdropStats.map((s) => (
              <div key={s.label} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={`mt-3 font-heading text-xl font-extrabold ${s.accent ? "text-primary" : "text-foreground"}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
