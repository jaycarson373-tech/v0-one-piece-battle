import { Coins, Swords, Trophy, ShieldCheck, Anchor } from "lucide-react"
import { howSteps, rarityTiers } from "@/lib/data"

const stepIcons = [Coins, Swords, Trophy]

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-y border-border bg-card/30">
      {/* battle banner backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64">
        <img
          src="/images/op-crew-battle.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">
            <Anchor className="h-3.5 w-3.5" /> Set sail in 3 steps
          </span>
          <h2 className="mt-4 text-balance font-display text-4xl uppercase text-foreground sm:text-5xl">
            How the <span className="text-primary">battle</span> works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            No devil fruit required. Enter, flip, and claim a real graded slab — every outcome provably fair on
            Solana.
          </p>
        </div>

        {/* steps */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {howSteps.map((s, i) => {
            const Icon = stepIcons[i] ?? Swords
            return (
              <div
                key={s.step}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg transition-colors hover:border-gold"
              >
                <span className="absolute -right-4 -top-4 font-display text-7xl text-muted/40 transition-colors group-hover:text-primary/20">
                  {s.step}
                </span>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-4 font-display text-xl uppercase text-foreground">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                {i < howSteps.length - 1 && (
                  <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-gold md:block" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* info cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
            <div className="flex items-center gap-2 text-gold">
              <Anchor className="h-5 w-5" />
              <h3 className="font-display text-xl uppercase text-foreground">What is One Piece Battle?</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A 1v1 Solana game where you pay an entry for a 50/50 shot at a real graded One Piece TCG card. The
              treasury is publicly verifiable on-chain — every card in the vault corresponds to a real graded slab
              mapped to its NFT, bonded and insured.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gold bg-gradient-to-br from-primary/90 to-primary p-7 text-primary-foreground shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-display text-xl uppercase">Why it&apos;s +EV for pirates</h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-primary-foreground/90">
              <li className="flex gap-2">
                <span className="text-gold">◆</span> $10 entry vs. an avg drawn card worth more — positive expected value.
              </li>
              <li className="flex gap-2">
                <span className="text-gold">◆</span> Treasury keeps acquiring new graded cards from entry proceeds.
              </li>
              <li className="flex gap-2">
                <span className="text-gold">◆</span> Win-back window lets you cash a slab for 80% instantly.
              </li>
            </ul>
          </div>
        </div>

        {/* rarity tiers */}
        <div className="mt-10">
          <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Bounty rarity tiers
          </h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rarityTiers.map((t) => (
              <div
                key={t.tier}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-md"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: t.color }} />
                <div className="p-4">
                  <span className="font-display text-base uppercase text-foreground">{t.tier}</span>
                  <div className="mt-1 text-xs text-muted-foreground">{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
