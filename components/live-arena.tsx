"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Shield, Swords, Sparkles, CheckCircle2, Dices, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { eligibleHolders, prizePool, type Holder, type PoolCard } from "@/lib/arena"
import { pickIndices, rollBattle, proofHash, pickWeighted } from "@/lib/provably-fair"

type Phase = "idle" | "snapshot" | "reveal" | "battle" | "result" | "airdrop"

const rarityStyles: Record<PoolCard["rarity"], { ring: string; chip: string; glow: string }> = {
  MYTHIC: { ring: "ring-primary border-primary", chip: "bg-primary text-primary-foreground", glow: "shadow-[0_0_40px_-8px] shadow-primary" },
  LEGENDARY: { ring: "ring-gold border-gold", chip: "bg-gold text-gold-foreground", glow: "shadow-[0_0_40px_-8px] shadow-gold" },
  RARE: { ring: "ring-ocean border-ocean", chip: "bg-ocean text-background", glow: "shadow-[0_0_30px_-10px] shadow-ocean" },
  COMMON: { ring: "ring-border border-border", chip: "bg-secondary text-muted-foreground", glow: "" },
}

function shortSeed(s: string) {
  return s.length > 18 ? `${s.slice(0, 10)}…${s.slice(-6)}` : s
}

// Generate a fresh public seed. In production this is the Solana slot blockhash.
function makeSeed() {
  const slot = 296_000_000 + Math.floor(Math.random() * 900_000)
  const hex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return `slot:${slot}:${hex}`
}

export function LiveArena() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [seed, setSeed] = useState<string>("")
  const [fighters, setFighters] = useState<[Holder, Holder] | null>(null)
  const [scores, setScores] = useState<{ a: number; b: number } | null>(null)
  const [winner, setWinner] = useState<"a" | "b" | null>(null)
  const [prize, setPrize] = useState<PoolCard | null>(null)
  const [prizeRevealed, setPrizeRevealed] = useState(false)
  const [reelOffset, setReelOffset] = useState(0)
  const [copied, setCopied] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const runBattle = useCallback(() => {
    clearTimers()
    setScores(null)
    setWinner(null)
    setReelOffset(0)
    setPrizeRevealed(false)

    // 1) commit a public seed
    const s = makeSeed()
    setSeed(s)
    setPhase("snapshot")

    // 2) deterministically select two holders from the eligible pool
    const [iA, iB] = pickIndices(s, eligibleHolders.length, 2)
    const fA = eligibleHolders[iA]
    const fB = eligibleHolders[iB]

    // draw the prize slab for this battle from the treasury pool (same seed)
    const prizeIdx = pickWeighted(s, prizePool.map((c) => c.weight))
    setPrize(prizePool[prizeIdx])

    timers.current.push(
      setTimeout(() => {
        setPhase("reveal")
        // case-opening reel lands on fighter A's index
        setReelOffset(iA)
      }, 1400),
    )

    // 3) battle animation
    timers.current.push(
      setTimeout(() => {
        setFighters([fA, fB])
        setPhase("battle")
      }, 3200),
    )

    // 4) settle result deterministically
    timers.current.push(
      setTimeout(() => {
        const r = rollBattle(s, fA.character.power, fB.character.power)
        setScores({ a: r.aScore, b: r.bScore })
        setWinner(r.winner)
        setPhase("result")
      }, 6000),
    )

    // 5) reveal the drawn prize pack-opening style, then airdrop
    timers.current.push(setTimeout(() => setPrizeRevealed(true), 7000))
    timers.current.push(
      setTimeout(() => setPhase("airdrop"), 8600),
    )
  }, [])

  const copySeed = () => {
    navigator.clipboard?.writeText(seed)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const reel = buildReel()

  return (
    <section id="arena-stage" className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* stage header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">Live Arena</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Shield className="h-4 w-4 text-ocean" />
            Provably fair · Solana VRF snapshot
          </div>
        </div>

        {/* prize banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-muted-foreground">On the line:</span>
            <span className="font-bold text-foreground">Mystery slab</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
              drawn from the vault
            </span>
          </div>
          <span className="font-heading text-sm font-extrabold text-muted-foreground">
            {prizePool.length}-card pool · up to $1,480
          </span>
        </div>

        {/* stage body */}
        <div className="px-5 py-8">
          {phase === "idle" && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-gold">
                <Swords className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-foreground">Two holders. One grail.</h3>
              <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                Hit start to draw a public seed, snapshot the eligible wallets, and watch two random pirates
                battle for the slab — settled and airdropped automatically.
              </p>
              <Button size="lg" className="mt-6 gap-2 rounded-full px-8" onClick={runBattle}>
                <Dices className="h-5 w-5" />
                Run a battle
              </Button>
            </div>
          )}

          {phase === "snapshot" && (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
              <p className="font-heading text-lg font-extrabold text-foreground">Capturing on-chain snapshot…</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Committing seed {shortSeed(seed)} · {eligibleHolders.length} eligible wallets
              </p>
            </div>
          )}

          {phase === "reveal" && (
            <div className="py-6">
              <p className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Drawing combatants…
              </p>
              {/* case-opening reel */}
              <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-secondary">
                <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-0.5 -translate-x-1/2 bg-primary" />
                <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2">
                  <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-primary" />
                </div>
                <div
                  className="flex gap-3 p-4 transition-transform duration-[1600ms] ease-out"
                  style={{ transform: `translateX(calc(50% - ${reelOffset * 152 + 68}px))` }}
                >
                  {reel.map((h, i) => (
                    <div
                      key={i}
                      className="flex h-32 w-36 flex-none flex-col items-center justify-center rounded-xl border border-border bg-card p-3 text-center"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-extrabold text-primary">
                        {h.character.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="mt-2 line-clamp-1 text-xs font-bold text-foreground">{h.character.name}</div>
                      <div className="text-[10px] text-muted-foreground">{h.handle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(phase === "battle" || phase === "result" || phase === "airdrop") && fighters && (
            <BattleStage
              fighters={fighters}
              scores={scores}
              winner={winner}
              phase={phase}
              seed={seed}
              prize={prize}
              prizeRevealed={prizeRevealed}
              onAgain={runBattle}
            />
          )}
        </div>

        {/* seed / proof footer */}
        {seed && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary px-5 py-3 text-xs">
            <div className="flex items-center gap-2 font-mono text-muted-foreground">
              <span className="font-sans font-semibold uppercase tracking-wider text-foreground">Seed</span>
              {shortSeed(seed)}
              <button onClick={copySeed} className="inline-flex items-center gap-1 text-ocean hover:underline">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "copied" : "copy"}
              </button>
            </div>
            {winner && (
              <div className="font-mono text-muted-foreground">
                <span className="font-sans font-semibold uppercase tracking-wider text-foreground">Proof</span>{" "}
                {proofHash(seed)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function BattleStage({
  fighters,
  scores,
  winner,
  phase,
  seed,
  prize,
  prizeRevealed,
  onAgain,
}: {
  fighters: [Holder, Holder]
  scores: { a: number; b: number } | null
  winner: "a" | "b" | null
  phase: Phase
  seed: string
  prize: PoolCard | null
  prizeRevealed: boolean
  onAgain: () => void
}) {
  const [a, b] = fighters
  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <FighterCard holder={a} side="a" winner={winner} score={scores?.a} />
        <div className="flex flex-col items-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full font-heading text-sm font-extrabold ${
              phase === "battle"
                ? "animate-pulse bg-primary text-primary-foreground"
                : "bg-foreground text-background"
            }`}
          >
            VS
          </div>
        </div>
        <FighterCard holder={b} side="b" winner={winner} score={scores?.b} />
      </div>

      {phase === "battle" && (
        <div className="mt-8 flex flex-col items-center">
          <Swords className="h-7 w-7 animate-pulse text-primary" />
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Clash in progress…
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">resolving {seed.slice(0, 14)}…</p>
        </div>
      )}

      {(phase === "result" || phase === "airdrop") && winner && (
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider text-gold-foreground">
            <Sparkles className="h-4 w-4" />
            {(winner === "a" ? a : b).handle} wins the slab
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {(winner === "a" ? a : b).character.name} stands victorious
          </p>

          {/* pack-opening prize reveal */}
          {prize && <PrizeReveal prize={prize} revealed={prizeRevealed} />}

          {phase === "airdrop" && prize ? (
            <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary px-6 py-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CheckCircle2 className="h-5 w-5 text-ocean" />
                {prize.name} airdropped
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                → {(winner === "a" ? a : b).wallet} · settled on-chain
              </p>
              <Button className="mt-2 gap-2 rounded-full" onClick={onAgain}>
                <Dices className="h-4 w-4" />
                Run another
              </Button>
            </div>
          ) : (
            !prizeRevealed && (
              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse text-gold" />
                Cracking the pack…
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function PrizeReveal({ prize, revealed }: { prize: PoolCard; revealed: boolean }) {
  const r = rarityStyles[prize.rarity]
  return (
    <div className="mt-6 flex flex-col items-center">
      <div
        className={`relative flex h-56 w-40 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 ring-2 transition-all duration-500 ${
          revealed ? `${r.ring} ${r.glow} scale-100` : "scale-95 border-border ring-border"
        }`}
      >
        {!revealed ? (
          <div className="flex flex-col items-center gap-2 bg-primary/5 px-3 text-center">
            <Sparkles className="h-8 w-8 animate-pulse text-gold" />
            <span className="font-heading text-sm font-extrabold text-muted-foreground">Sealed slab</span>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col bg-card">
            <div className={`flex items-center justify-center py-1 text-[10px] font-bold uppercase tracking-widest ${r.chip}`}>
              {prize.rarity}
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-3 text-center">
              <span className="font-heading text-sm font-extrabold leading-tight text-foreground text-balance">
                {prize.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{prize.set}</span>
              <span className="mt-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-foreground">
                {prize.grade}
              </span>
            </div>
            <div className="border-t border-border py-1.5 font-heading text-lg font-extrabold text-primary">
              ${prize.value}
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {revealed ? "Drawn from the treasury vault" : "Verifiable draw from the same seed"}
      </p>
    </div>
  )
}

function FighterCard({
  holder,
  side,
  winner,
  score,
}: {
  holder: Holder
  side: "a" | "b"
  winner: "a" | "b" | null
  score?: number
}) {
  const isWinner = winner === side
  const isLoser = winner !== null && winner !== side
  return (
    <div
      className={`rounded-2xl border p-4 text-center transition-all ${
        isWinner
          ? "border-gold bg-gold/10 ring-2 ring-gold"
          : isLoser
            ? "border-border bg-secondary opacity-50"
            : "border-border bg-card"
      }`}
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full font-heading text-lg font-extrabold ${
          isWinner ? "bg-gold text-gold-foreground" : "bg-primary/10 text-primary"
        }`}
      >
        {holder.character.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
      </div>
      <div className="mt-3 font-heading text-base font-extrabold leading-tight text-foreground sm:text-lg">
        {holder.character.name}
      </div>
      <div className="text-xs text-muted-foreground">{holder.character.epithet}</div>
      <div className="mt-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
        {holder.handle} · {holder.wallet}
      </div>
      <div className="mt-3 border-t border-border pt-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {score != null ? "Battle score" : "Base power"}
        </div>
        <div className={`font-heading text-2xl font-extrabold ${isWinner ? "text-gold-foreground" : "text-foreground"}`}>
          {score != null ? score : holder.character.power}
        </div>
      </div>
    </div>
  )
}

// Build a long reel for the case-opening animation by repeating the pool.
function buildReel(): Holder[] {
  const reps = 4
  const out: Holder[] = []
  for (let r = 0; r < reps; r++) out.push(...eligibleHolders)
  return out
}
