import { howSteps, rarityTiers } from "@/lib/data"

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-heading text-3xl font-extrabold text-foreground">How it works</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">3 steps</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {howSteps.map((s) => (
          <div key={s.step} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="font-mono text-sm font-bold text-primary">{s.step}</div>
            <h3 className="mt-2 font-heading text-lg font-extrabold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-heading text-lg font-extrabold text-foreground">What is One Piece Battle?</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            One Piece Battle is a 1v1 Solana game where you pay an entry for a 50/50 shot at a real graded One
            Piece TCG card. The treasury is publicly verifiable on-chain — every card you see above corresponds
            to a real graded card mapped to its NFT.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-foreground p-6 text-background shadow-sm">
          <h3 className="font-heading text-lg font-extrabold">Why it&apos;s +EV for pirates</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-background/80">
            <li>• $10 entry vs. an avg drawn card worth more — positive expected value.</li>
            <li>• Treasury keeps acquiring new graded cards from entry proceeds.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rarity tiers</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {rarityTiers.map((t) => (
            <div key={t.tier} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="font-heading text-sm font-extrabold text-foreground">{t.tier}</span>
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
