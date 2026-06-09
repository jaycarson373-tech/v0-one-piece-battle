"use client"

import { useEffect, useState } from "react"
import { Terminal } from "lucide-react"
import {
  getSupabaseDuelsClient,
  PROOF_LOG_REALTIME_CHANNEL,
  PROOF_LOG_REALTIME_FILTER,
  type ProofLogRow,
} from "@/lib/supabase-duels"
import { shortWallet } from "@/lib/duel-store"
import { subscribeWithBackoff } from "@/lib/supabase-realtime"

export function ProofClient() {
  const [results, setResults] = useState<ProofLogRow[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()

    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    async function loadProof() {
      const { data, error } = await supabase
        .from("proof_log")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50)

      if (error) {
        setMessage(error.message)
        return
      }

      setResults(data ?? [])
    }

    return subscribeWithBackoff({
      supabase,
      label: "proof log",
      onSubscribed: () => void loadProof(),
      createChannel: () =>
        supabase.channel(PROOF_LOG_REALTIME_CHANNEL).on("postgres_changes", PROOF_LOG_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<ProofLogRow>
          setResults((items) => items.filter((item) => item.event_id !== deleted.event_id))
          return
        }

        const nextProof = payload.new as ProofLogRow
        setResults((items) => {
          const existing = items.filter((item) => item.event_id !== nextProof.event_id)
          return [nextProof, ...existing].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 50)
        })
      }),
    })
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

      {message && (
        <div className="mb-6 rounded-2xl border border-gold/40 bg-secondary p-4 text-sm font-medium text-foreground">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-foreground text-background">
        <div className="flex items-center justify-between border-b border-background/10 px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-widest text-background/60">proof log</span>
          <span className="rounded-full bg-background/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
            dry-run
          </span>
        </div>
        <div className="divide-y divide-background/10">
          {results.length === 0 ? (
            <div className="p-5 font-mono text-sm text-background/60">No proof records yet.</div>
          ) : (
            results.map((result) => (
              <div key={`${result.event_id}-${result.timestamp}`} className="grid gap-3 p-5 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-gold">{result.event_id}</span>
                  <span className="text-background/60">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <TerminalRow label="Event type" value={result.event_type} />
                  <TerminalRow label="Winner" value={result.winner_wallet ? shortWallet(result.winner_wallet) : "-"} />
                  <TerminalRow label="Slab assigned" value={result.slab_id ?? "-"} />
                  <TerminalRow label="VRF proof" value={result.vrf_proof ?? "-"} />
                  <TerminalRow label="Result hash" value={result.result_hash ?? "-"} />
                  <TerminalRow label="Status" value={result.status} />
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
