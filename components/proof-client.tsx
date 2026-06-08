"use client"

import { useEffect, useState } from "react"
import { Terminal } from "lucide-react"
import { DUEL_EVENT, DUEL_RESULTS_KEY, type DuelResult, readJsonArray, shortWallet } from "@/lib/duel-store"

export function ProofClient() {
  const [results, setResults] = useState<DuelResult[]>([])

  useEffect(() => {
    const syncResults = () => setResults(readJsonArray<DuelResult>(DUEL_RESULTS_KEY).slice(0, 10))
    syncResults()
    window.addEventListener(DUEL_EVENT, syncResults)
    window.addEventListener("storage", syncResults)
    return () => {
      window.removeEventListener(DUEL_EVENT, syncResults)
      window.removeEventListener("storage", syncResults)
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Terminal className="h-4 w-4" />
          Proof Terminal
        </div>
        <h1 className="font-display text-4xl uppercase text-foreground sm:text-5xl">Proof</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-foreground text-background">
        <div className="flex items-center justify-between border-b border-background/10 px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-widest text-background/60">last 10 duel results</span>
          <span className="rounded-full bg-background/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
            dry-run
          </span>
        </div>
        <div className="divide-y divide-background/10">
          {results.length === 0 ? (
            <div className="p-5 font-mono text-sm text-background/60">No duel results recorded yet.</div>
          ) : (
            results.map((result) => (
              <div key={`${result.eventId}-${result.timestamp}`} className="grid gap-3 p-5 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-gold">{result.eventId}</span>
                  <span className="text-background/60">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <TerminalRow label="Commit hash" value={result.commitHash} />
                  <TerminalRow label="VRF proof" value={result.vrfProof} />
                  <TerminalRow label="Result hash" value={result.resultHash} />
                  <TerminalRow label="Player A" value={shortWallet(result.playerA)} />
                  <TerminalRow label="Player B" value={shortWallet(result.playerB)} />
                  <TerminalRow label="Winner" value={shortWallet(result.winnerWallet)} />
                  <TerminalRow label="Settlement tx" value={result.settlementTx} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function TerminalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-background/40">{label}</div>
      <div className="truncate text-background">{value}</div>
    </div>
  )
}
