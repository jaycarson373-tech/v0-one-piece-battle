import { Users, Swords, Trophy } from "lucide-react"
import { howSteps, rarityTiers } from "@/lib/data"

const stepIcons = [Users, Swords, Trophy]

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-t border-border">
      {/* Showdown backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-treasure-battle.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">3 steps to treasure</span>
          <h2 className="mt-2 font-display text-4xl uppercase text-foreground text-shadow-poster sm:text-5xl">
            How it works
          </h2>
        </div>

        {/* step flow */}
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {/* connector line on desktop */}
          <div
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block"
            aria-hidden="true"
          />
          {howSteps.map((s, i) => {
            const Icon = stepIcons[i]
            return (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-gold bg-card p-4 shadow-xl shadow-black/30">
                  <Icon className="h-8 w-8 text-gold" strokeWidth={2} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
            <h3 className="font-heading text-lg font-extrabold text-foreground">What is One Piece Battle?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              One Piece Battle is a Solana game where two random slab-holders are drawn each round and battle for
              a prize. The treasury is publicly verifiable on-chain — every card you see above corresponds to a
              real graded card mapped to its NFT.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-foreground p-6 text-background shadow-sm">
            <h3 className="font-heading text-lg font-extrabold">Provably fair, every round</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-background/80">
              <li>• Holders are drawn from a public on-chain snapshot — no hand-picking.</li>
              <li>• The winner is chosen at random via Solana VRF and the prize is airdropped instantly.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Rarity tiers
          </h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rarityTiers.map((t) => (
              <div key={t.tier} className="rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-heading text-sm font-extrabold text-foreground">{t.tier}</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">{t.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
