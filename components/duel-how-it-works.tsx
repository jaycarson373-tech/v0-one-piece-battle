import { Wallet, Swords, Trophy, ShieldCheck } from "lucide-react"
import { duelSteps, duelRules } from "@/lib/data"

const stepIcons = [Wallet, Swords, Trophy]

export function DuelHowItWorks() {
  return (
    <section id="duel" className="relative overflow-hidden border-t border-border">
      {/* Faceoff backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-faceoff-spiral.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Player vs player</span>
          <h2 className="mt-2 font-display text-4xl uppercase text-foreground text-shadow-poster sm:text-5xl">
            Slab Duels
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Don&apos;t wait to be drawn. Put your own slab on the line, challenge another holder head-to-head, and
            winner takes both.
          </p>
        </div>

        {/* step flow */}
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
            aria-hidden="true"
          />
          {duelSteps.map((s, i) => {
            const Icon = stepIcons[i]
            return (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-card p-4 shadow-xl shadow-black/30">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold font-mono text-xs font-bold text-background">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            )
          })}
        </div>

        {/* duel rules */}
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/40 bg-card/80 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-extrabold text-foreground">How a duel works</h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {duelRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-gold/40 bg-foreground p-6 text-background shadow-sm">
            <div>
              <h3 className="font-heading text-lg font-extrabold">Draw vs Duel</h3>
              <p className="mt-3 text-sm leading-relaxed text-background/80">
                In the <span className="font-bold text-background">Live Arena</span>, two random holders are drawn and
                the winner takes a prize from the treasury. In a <span className="font-bold text-background">Duel</span>,
                you choose your opponent and stake your own slab — pure player vs player.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-background/20 bg-background/10 p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-background/60">Stake</div>
                <div className="font-heading text-sm font-extrabold">Your own slab</div>
              </div>
              <div className="rounded-xl border border-background/20 bg-background/10 p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-background/60">Prize</div>
                <div className="font-heading text-sm font-extrabold">Both slabs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
            Duels coming soon
          </span>
        </div>
      </div>
    </section>
  )
}
