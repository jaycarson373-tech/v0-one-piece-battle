import { Terminal, ShieldCheck, ChevronRight } from "lucide-react"
import { proofRecords, type ProofRecord } from "@/lib/kotp"

const typeColor: Record<ProofRecord["type"], string> = {
  Duel: "text-primary",
  "Holder Airdrop": "text-gold",
  "Card Selection": "text-ocean",
}

const statusColor: Record<ProofRecord["status"], string> = {
  Settled: "text-ocean",
  Pending: "text-gold",
  Resolving: "text-primary",
}

function Field({ label, value, mono = true, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-background/10 py-1.5 last:border-0">
      <span className="text-[11px] uppercase tracking-wider text-background/45">{label}</span>
      <span className={`${mono ? "font-mono" : "font-heading font-bold"} text-xs ${color ?? "text-background/90"}`}>
        {value}
      </span>
    </div>
  )
}

export function ProofTerminal() {
  return (
    <section id="proof" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ocean">
          <ShieldCheck className="h-4 w-4" /> Proof of Random
        </div>
        <h2 className="max-w-3xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
          Every round, logged & verifiable.
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every duel and card airdrop generates a public proof record. The terminal shows the duel ID, player
          wallets, committed hash, randomness source, result hash, and settlement transaction.
        </p>

        {/* terminal */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-foreground shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-background/15 px-4 py-2.5">
            <div className="flex items-center gap-2 font-mono text-xs text-background/70">
              <Terminal className="h-3.5 w-3.5" />
              king-of-the-pirates / proof-terminal
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-background/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-background/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            </div>
          </div>

          <div className="grid gap-px bg-background/10 sm:grid-cols-2">
            {proofRecords.map((r) => (
              <div key={r.eventId} className="bg-foreground p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-background">{r.eventId}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColor[r.type]}`}>
                    {r.type}
                  </span>
                </div>
                <Field label="Player Wallets" value={r.wallets.join("  ·  ")} />
                <Field label="Wager" value={r.wager} />
                <Field label="Randomness Proof" value={r.randomnessProof} />
                <Field label="Result Hash" value={r.resultHash} />
                <Field label="Winner" value={r.winner} color="text-gold" />
                <Field label="Settlement Tx" value={r.settlementTx} />
                <Field label="Status" value={r.status} color={statusColor[r.status]} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full border border-ocean bg-transparent px-7 py-3 text-sm font-bold uppercase tracking-wider text-ocean transition-colors hover:bg-ocean hover:text-ocean-foreground">
            Verify a Round <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
