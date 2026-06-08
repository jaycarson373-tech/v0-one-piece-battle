import { Swords, Dice5, Vault, Gift, ShieldCheck } from "lucide-react"
import { kotpHowSteps } from "@/lib/kotp"

const stepIcons = [Swords, Dice5, Vault, Gift, ShieldCheck]

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-t border-border">
      {/* battle backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-treasure-battle.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Duel · Prove · Reward</span>
          <h2 className="mt-2 font-display text-4xl uppercase text-foreground text-shadow-poster sm:text-5xl">
            How it works
          </h2>
        </div>

        {/* step flow */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kotpHowSteps.map((s, i) => {
            const Icon = stepIcons[i]
            return (
              <div
                key={s.step}
                className="relative flex flex-col rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/50 bg-secondary">
                    <Icon className="h-5 w-5 text-gold" strokeWidth={2} />
                  </div>
                  <span className="font-display text-2xl text-border">{s.step}</span>
                </div>
                <h3 className="mt-4 font-heading text-base font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
            <h3 className="font-heading text-lg font-extrabold text-foreground">What is King of the Pirates?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              King of the Pirates is a Solana-powered pirate duel arena where players enter $10 duels,
              challenge another player, or accept open duels. Fees flow into a treasury that buys real graded
              cards, and holders receive random treasury card airdrops every 30–60 minutes.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-foreground p-6 text-background shadow-sm">
            <h3 className="font-heading text-lg font-extrabold">Provably fair, every round</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-background/80">
              <li>• Every duel winner is decided by a verifiable randomness mechanism — no house edge.</li>
              <li>• Each duel, card selection, and holder airdrop is logged to the public Proof Terminal.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
