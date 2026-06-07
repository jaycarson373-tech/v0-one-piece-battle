import { ShieldCheck, GitBranch, Hash, Camera } from "lucide-react"

const steps = [
  {
    icon: Camera,
    title: "1 · On-chain snapshot",
    body: "At the battle slot we read the Solana blockhash and the full list of slab-holding wallets. The seed is committed on-chain before anything is drawn.",
  },
  {
    icon: Hash,
    title: "2 · Deterministic draw",
    body: "FNV-1a hashes the public seed into a mulberry32 PRNG that selects two distinct wallets. Same seed always yields the same two fighters.",
  },
  {
    icon: ShieldCheck,
    title: "3 · Verifiable battle",
    body: "Base power counts for 60%, verifiable randomness for 40% — so upsets happen but nothing is rigged. The result is a pure function of the seed.",
  },
]

const codeSample = `// provably-fair.ts — published, dependency-free, portable
import { pickIndices, rollBattle, proofHash } from "./provably-fair"

const seed = "slot:296481023:9f3a1c…"   // committed on-chain
const [a, b] = pickIndices(seed, holders.length, 2)
const result = rollBattle(seed, holders[a].power, holders[b].power)

// anyone can re-run this to verify the winner + proof
console.log(result.winner, proofHash(seed))`

export function ProvablyFair() {
  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-secondary p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-ocean" />
          <h2 className="font-heading text-2xl font-extrabold text-foreground">Provably fair, by design</h2>
        </div>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Every battle is a pure function of a public seed. We publish the exact selection + battle code to
          GitHub so anyone — including automated agents like Codex — can reproduce any outcome and confirm we
          never touched the result.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-heading text-base font-extrabold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-foreground">
          <div className="flex items-center justify-between border-b border-background/15 px-4 py-2.5">
            <div className="flex items-center gap-2 font-mono text-xs text-background/70">
              <GitBranch className="h-3.5 w-3.5" />
              one-piece-battle / lib / provably-fair.ts
            </div>
            <a
              href="#"
              className="rounded-full bg-background/15 px-3 py-1 text-xs font-semibold text-background hover:bg-background/25"
            >
              View on GitHub
            </a>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-background/90">
            <code>{codeSample}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
