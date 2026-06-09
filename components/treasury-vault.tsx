"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Vault as VaultIcon, ArrowRight } from "lucide-react"
import { treasurySplit, cardTiers } from "@/lib/kotp"
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

export function TreasuryVault() {
  const [cards, setCards] = useState<VaultCardRow[]>([])
  const [proofLog, setProofLog] = useState<ProofLogRow[]>([])

  const totalValue = useMemo(() => cards.reduce((sum, card) => sum + Number(card.value_usd), 0), [cards])
  const duelWinnerSlabIds = useMemo(
    () =>
      new Set(
        proofLog
          .filter((proof) => proof.event_type === "duel_slab_assignment" && proof.slab_id)
          .map((proof) => proof.slab_id as string),
      ),
    [proofLog],
  )
  const lastHolderWinner = proofLog.find(
    (proof) => proof.event_type === "holder_airdrop" && isRealWinnerWallet(proof.winner_wallet),
  )?.winner_wallet
  const treasuryStats: { label: string; value: ReactNode; accent?: boolean }[] = [
    { label: "Treasury Balance", value: formatUsd(totalValue), accent: true },
    { label: "Cards Purchased", value: cards.length.toString() },
    { label: "Cards Available", value: cards.filter((card) => card.status === "available").length.toString() },
    { label: "Next Airdrop", value: <AirdropCountdown />, accent: true },
    {
      label: "Airdropped to Duel Winners",
      value: cards.filter((card) => card.assigned_to && duelWinnerSlabIds.has(card.id)).length.toString(),
    },
    {
      label: "Airdropped to Holders",
      value: proofLog.filter((proof) => proof.event_type === "holder_airdrop").length.toString(),
    },
    { label: "Last Winner", value: lastHolderWinner ? shortWallet(lastHolderWinner) : "-" },
  ]

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()
    if (!supabase) return

    async function loadStats() {
      const [cardsResponse, proofResponse] = await Promise.all([
        supabase.from("vault_cards").select("*").order("created_at", { ascending: false }),
        supabase.from("proof_log").select("*").order("timestamp", { ascending: false }),
      ])

      setCards(cardsResponse.data ?? [])
      setProofLog(proofResponse.data ?? [])
    }

    const removeVaultChannel = subscribeWithBackoff({
      supabase,
      label: "homepage treasury cards",
      onSubscribed: () => void loadStats(),
      createChannel: () =>
        supabase.channel(`${VAULT_CARDS_REALTIME_CHANNEL}:homepage-treasury`).on("postgres_changes", VAULT_CARDS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<VaultCardRow>
          setCards((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const nextCard = payload.new as VaultCardRow
        setCards((items) => [nextCard, ...items.filter((item) => item.id !== nextCard.id)])
      }),
    })

    const removeProofChannel = subscribeWithBackoff({
      supabase,
      label: "homepage treasury proof",
      createChannel: () =>
        supabase.channel(`${PROOF_LOG_REALTIME_CHANNEL}:homepage-treasury`).on("postgres_changes", PROOF_LOG_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") return

        const proof = payload.new as ProofLogRow
        setProofLog((items) => [proof, ...items.filter((item) => item.event_id !== proof.event_id)])
      }),
    })

    return () => {
      removeVaultChannel()
      removeProofChannel()
    }
  }, [])

  return (
    <section id="vault" className="relative overflow-hidden border-b border-border">
      {/* vault backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bg/battle.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
          <VaultIcon className="h-4 w-4" /> The Pirate Vault
        </div>
        <h2 className="max-w-3xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
          Fees become real cards.
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Duel entries feed the treasury. The treasury buys real cards and slabs, then uses them for holder
          airdrops, duel prizes, and vault growth.
        </p>

        {/* vault stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {treasuryStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <div className={`font-heading text-xl font-extrabold ${s.accent ? "text-gold" : "text-foreground"}`}>
                {s.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* treasury split */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-base font-extrabold text-foreground">Treasury Split</h3>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full">
              {treasurySplit.map((s) => (
                <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {treasurySplit.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-bold text-foreground">{s.pct}%</span> {s.label}
                </li>
              ))}
            </ul>
          </div>

          {/* card tiers */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-base font-extrabold text-foreground">Card Tiers</h3>
            <ul className="mt-4 space-y-2.5">
              {cardTiers.map((t) => (
                <li key={t.tier} className="flex items-center gap-3">
                  <span
                    className="rounded-md px-2 py-0.5 font-display text-xs uppercase tracking-wide"
                    style={{ color: t.color, border: `1px solid ${t.color}` }}
                  >
                    {t.tier}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

function isRealWinnerWallet(wallet: string | null) {
  if (!wallet) return false
  return !/(111111|222222|333333|444444)/.test(wallet)
}
