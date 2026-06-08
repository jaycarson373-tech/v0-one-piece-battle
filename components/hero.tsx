import { Swords, Eye, Terminal } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

const statusPills = [
  { label: "Live Arena", live: true },
  { label: "Proof of Random", live: false },
  { label: "Treasury Active", live: false },
  { label: "Holder Airdrops", live: false },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      {/* pirate duel arena backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-faceoff-spiral.jpeg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
        <div className="slash-lines absolute inset-0 opacity-60" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
        {/* left: copy */}
        <div className="text-center lg:text-left">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-widest text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" /> Live on Solana
            </span>
            <span className="text-border">/</span>
            <span>Provably Fair</span>
            <span className="text-border">/</span>
            <span>Real Card Airdrops</span>
          </div>

          <h1 className="text-balance font-display text-5xl uppercase leading-[0.92] text-foreground text-shadow-poster sm:text-7xl">
            Become <span className="text-primary">King</span> of the Pirates.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty font-heading text-lg font-bold text-foreground lg:mx-0">
            Enter live pirate duels, prove the randomness, and watch the treasury turn fees into real card
            airdrops.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground lg:mx-0">
            Enter a $10 duel. Challenge another pirate, accept an open duel, or enter the house arena.
            Every battle is resolved through a provably fair randomness system, logged publicly, and displayed
            inside the Proof Terminal.
          </p>

          {/* status pills */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {statusPills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur"
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${p.live ? "live-pulse bg-primary" : "bg-gold"}`}
                />
                {p.label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="#arena"
              className={buttonVariants({ size: "lg", className: "strike-hover gap-2 rounded-full px-7 text-base" })}
            >
              <Swords className="h-5 w-5" />
              Enter the Arena
            </a>
            <a
              href="#duels"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "gap-2 rounded-full border-border bg-card/50 px-7 text-base text-foreground hover:bg-card",
              })}
            >
              <Eye className="h-5 w-5" />
              View Live Duels
            </a>
            <a
              href="#proof"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "gap-2 rounded-full border-gold bg-transparent px-7 text-base text-gold hover:bg-gold hover:text-gold-foreground",
              })}
            >
              <Terminal className="h-5 w-5" />
              Open Proof Terminal
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            $10 duels · Provably fair · Fees buy real cards for holder airdrops
          </p>
        </div>

        {/* right: VS duel panel */}
        <div className="relative">
          <div className="battle-glow relative overflow-hidden rounded-3xl border-2 border-gold/60 bg-card shadow-2xl shadow-black/40">
            <img
              src="/images/op-luffy-pumped.jpeg"
              alt="Two pirates clashing in a duel arena"
              className="h-64 w-full object-cover object-top sm:h-80"
            />
            <div className="slash-lines absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/55" />

            <div className="absolute inset-x-0 top-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              Live Duel · $18 Pool
            </div>

            {/* two duelers */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-ocean/60 bg-background/85 px-3 py-2 backdrop-blur">
              <div className="text-[9px] font-bold uppercase tracking-wider text-ocean">Challenger</div>
              <div className="font-mono text-sm font-bold text-foreground">9f2K…D4uM</div>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-primary/60 bg-background/85 px-3 py-2 text-right backdrop-blur">
              <div className="text-[9px] font-bold uppercase tracking-wider text-primary">Opponent</div>
              <div className="font-mono text-sm font-bold text-foreground">Bv7Q…s1Re</div>
            </div>

            {/* VS badge */}
            <div className="vs-clash absolute left-1/2 top-1/2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary font-display text-2xl text-primary-foreground">
              VS
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" /> Resolving
              </div>
              <span className="rounded-full bg-background/80 px-2.5 py-1 font-mono text-xs font-bold text-foreground">
                $15–100+
              </span>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-gold bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold shadow-lg">
            Next airdrop · 41:08
          </div>
        </div>
      </div>
    </section>
  )
}
