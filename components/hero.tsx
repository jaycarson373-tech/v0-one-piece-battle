import { Swords } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { heroModes } from "@/lib/data"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      {/* One Piece faceoff battle backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/images/op-faceoff.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/75 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/85" />
        <div className="slash-lines absolute inset-0 opacity-60" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
        {/* left: copy */}
        <div className="text-center lg:text-left">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-widest text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" /> Live on Solana
            </span>
            <span className="text-border">/</span>
            <span>Real Graded Slabs</span>
            <span className="text-border">/</span>
            <span>Settled in SOL</span>
          </div>

          <h1 className="text-balance font-display text-5xl uppercase leading-[0.92] text-foreground text-shadow-poster sm:text-7xl">
            Two Pirates. <span className="text-primary">One Slab.</span> Winner Takes All.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground lg:mx-0">
            Two pirates. One graded slab on the line. Pay an entry to spin for a real PSA- or CGC-graded One
            Piece card, or wager your own against a rival. Winner takes the treasure — settled in SOL,
            instantly and provably fair.
          </p>

          {/* mode pills */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {heroModes.map((m, i) => {
              const comingSoon = m.toLowerCase().includes("duel")
              return (
                <span
                  key={m}
                  className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${
                    comingSoon
                      ? "border-dashed border-gold/60 bg-card/40 text-muted-foreground backdrop-blur"
                      : i === 0
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card/70 text-foreground backdrop-blur"
                  }`}
                >
                  {m}
                  {comingSoon && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
                      Soon
                    </span>
                  )}
                </span>
              )
            })}
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a href="/arena" className={buttonVariants({ size: "lg", className: "strike-hover gap-2 rounded-full px-8 text-base" })}>
              <Swords className="h-5 w-5" />
              Enter the Arena
            </a>
            <a
              href="#how"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-full border-gold bg-transparent px-8 text-base text-gold hover:bg-gold hover:text-gold-foreground",
              })}
            >
              How it works
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">$10 standard · avg $18 · $25 premium · avg $22</p>
        </div>

        {/* right: VS battle graphic */}
        <div className="relative">
          <div className="battle-glow relative overflow-hidden rounded-3xl border-2 border-gold/60 bg-card shadow-2xl shadow-black/40">
            <img
              src="/images/op-luffy-punch.jpeg"
              alt="One Piece characters clashing in battle"
              className="h-64 w-full object-cover sm:h-80"
            />
            <div className="slash-lines absolute inset-0 opacity-40" />
            {/* VS badge */}
            <div className="vs-clash absolute left-1/2 top-1/2 flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary font-display text-3xl text-primary-foreground">
              VS
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold">
                <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" /> Battle in progress
              </div>
              <span className="rounded-full bg-background/80 px-2.5 py-1 font-mono text-xs font-bold text-foreground">
                Prize · CGC 10
              </span>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-gold bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold shadow-lg">
            Next draw · 04:12
          </div>
        </div>
      </div>
    </section>
  )
}
