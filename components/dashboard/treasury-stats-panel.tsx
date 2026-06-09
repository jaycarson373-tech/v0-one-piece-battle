"use client"

import { useEffect, useMemo, useState } from "react"
import { Vault } from "lucide-react"
import {
  getSupabaseDuelsClient,
  VAULT_CARDS_REALTIME_CHANNEL,
  VAULT_CARDS_REALTIME_FILTER,
  type VaultCardRow,
} from "@/lib/supabase-duels"
import { subscribeWithBackoff } from "@/lib/supabase-realtime"

const PHYGITALS_URL =
  "https://www.phygitals.com/u/IceChallenger429/cards?priceRange=%2C&fmvRange=%2C&category=Pokemon%2COne+Piece%2CBasketball%2CBaseball%2CFootball%2CSoccer%2CYu-Gi-Oh%21%2CRiftbound%2CDragon+Ball%2CFwog%2CNEUKO%2CVibes%2CMoonbirds&gradeType=&listing=All+Items"

export function TreasuryStatsPanel() {
  const [cards, setCards] = useState<VaultCardRow[]>([])

  const totalValue = useMemo(() => cards.reduce((sum, card) => sum + Number(card.value_usd), 0), [cards])

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()
    if (!supabase) return

    async function loadCards() {
      const { data } = await supabase.from("vault_cards").select("*").order("created_at", { ascending: false })
      setCards(data ?? [])
    }

    return subscribeWithBackoff({
      supabase,
      label: "dashboard treasury cards",
      onSubscribed: () => void loadCards(),
      createChannel: () =>
        supabase.channel(`${VAULT_CARDS_REALTIME_CHANNEL}:dashboard-treasury`).on("postgres_changes", VAULT_CARDS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<VaultCardRow>
          setCards((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const nextCard = payload.new as VaultCardRow
        setCards((items) => [nextCard, ...items.filter((item) => item.id !== nextCard.id)])
      }),
    })
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-extrabold text-foreground">Treasury</h3>
        <Vault className="h-5 w-5 text-gold" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Total Cards" value={cards.length.toString()} />
        <Metric label="Total Vault Value" value={formatUsd(totalValue)} />
      </div>

      <a
        href={PHYGITALS_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex text-sm font-bold text-gold hover:text-primary"
      >
        View Full Vault
      </a>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <div className="truncate font-display text-xl text-foreground">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}
