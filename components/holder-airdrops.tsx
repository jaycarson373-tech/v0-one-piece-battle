"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Gift, Ticket } from "lucide-react"
import { airdropFlow } from "@/lib/kotp"
import { AirdropCountdown } from "@/components/airdrop-countdown"
import { shortWallet } from "@/lib/duel-store"
import {
  getSupabaseDuelsClient,
  PROOF_LOG_REALTIME_CHANNEL,
  PROOF_LOG_REALTIME_FILTER,
  VAULT_CARDS_REALTIME_CHANNEL,
  VAULT_CARDS_REALTIME_FILTER,
  type ProofLogRow,
  type VaultCardRow,
} from "@/lib/supabase-duels"
import { subscribeWithBackoff } from "@/lib/supabase-realtime"

const MOCK_ELIGIBLE_HOLDERS = 1284

export function HolderAirdrops() {
  const [proofLog, setProofLog] = useState<ProofLogRow[]>([])
  const [vaultCards, setVaultCards] = useState<VaultCardRow[]>([])

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()
    if (!supabase) return

    async function loadAirdropData() {
      const [proofResponse, cardsResponse] = await Promise.all([
        supabase
          .from("proof_log")
          .select("*")
          .eq("event_type", "holder_airdrop")
          .order("timestamp", { ascending: false }),
        supabase.from("vault_cards").select("*").order("created_at", { ascending: false }),
      ])

      setProofLog(proofResponse.data ?? [])
      setVaultCards(cardsResponse.data ?? [])
    }

    const removeProofChannel = subscribeWithBackoff({
      supabase,
      label: "airdrops proof log",
      onSubscribed: () => void loadAirdropData(),
      createChannel: () =>
        supabase.channel(`${PROOF_LOG_REALTIME_CHANNEL}:airdrops-page`).on("postgres_changes", PROOF_LOG_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<ProofLogRow>
          setProofLog((items) => items.filter((item) => item.event_id !== deleted.event_id))
          return
        }

        const proof = payload.new as ProofLogRow
        if (proof.event_type !== "holder_airdrop") return

        setProofLog((items) => {
          const existing = items.filter((item) => item.event_id !== proof.event_id)
          return [proof, ...existing].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        })
      }),
    })

    const removeVaultChannel = subscribeWithBackoff({
      supabase,
      label: "airdrops vault cards",
      createChannel: () =>
        supabase.channel(`${VAULT_CARDS_REALTIME_CHANNEL}:airdrops-page`).on("postgres_changes", VAULT_CARDS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<VaultCardRow>
          setVaultCards((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const card = payload.new as VaultCardRow
        setVaultCards((items) => [card, ...items.filter((item) => item.id !== card.id)])
      }),
    })

    return () => {
      removeProofChannel()
      removeVaultChannel()
    }
  }, [])

  const stats = useMemo(() => buildAirdropStats(proofLog, vaultCards), [proofLog, vaultCards])

  return (
    <section id="airdrops" className="relative overflow-hidden border-b border-border">
      {/* coast backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bg/coast.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-bottom opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Gift className="h-4 w-4" /> Holder Card Airdrops
        </div>
        <h2 className="max-w-3xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
          Hold tokens. Win real cards.
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every hour, the system selects a random holder and a random card from the vault. Holder odds
          are supply-weighted: every 100K tokens equals one ticket.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* airdrop flow */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-gold" />
              <h3 className="font-heading text-base font-extrabold text-foreground">Airdrop Flow</h3>
            </div>
            <ol className="mt-5 space-y-3">
              {airdropFlow.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-gold/40 bg-secondary font-mono text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* airdrop stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={`mt-3 font-heading text-xl font-extrabold ${s.accent ? "text-primary" : "text-foreground"}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function buildAirdropStats(proofLog: ProofLogRow[], vaultCards: VaultCardRow[]) {
  const latestAirdrop = proofLog[0]
  const latestCard = latestAirdrop?.slab_id ? vaultCards.find((card) => card.id === latestAirdrop.slab_id) : null

  return [
    { label: "Next Airdrop", value: <AirdropCountdown />, accent: true },
    { label: "Last Winner", value: latestAirdrop?.winner_wallet ? shortWallet(latestAirdrop.winner_wallet) : "-" },
    { label: "Card Won", value: latestCard ? latestCard.name : latestAirdrop?.slab_id ?? "-" },
    { label: "Total Airdrops", value: proofLog.length.toString() },
    { label: "Eligible Holders", value: MOCK_ELIGIBLE_HOLDERS.toLocaleString() },
  ] satisfies { label: string; value: ReactNode; accent?: boolean }[]
}
