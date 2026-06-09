"use client"

import { useEffect, useMemo, useState } from "react"
import { Vault as VaultIcon } from "lucide-react"
import {
  getSupabaseDuelsClient,
  VAULT_CARDS_REALTIME_CHANNEL,
  VAULT_CARDS_REALTIME_FILTER,
  type VaultCardRow,
} from "@/lib/supabase-duels"

const tierClass: Record<string, string> = {
  COMMON: "border-muted-foreground text-muted-foreground",
  RARE: "border-ocean text-ocean",
  EPIC: "border-purple-400 text-purple-300",
  LEGENDARY: "border-orange-400 text-orange-300",
  MYTHIC: "border-gold text-primary",
}

const PHYGITALS_URL =
  "https://www.phygitals.com/u/IceChallenger429/cards?priceRange=%2C&fmvRange=%2C&category=Pokemon%2COne+Piece%2CBasketball%2CBaseball%2CFootball%2CSoccer%2CYu-Gi-Oh%21%2CRiftbound%2CDragon+Ball%2CFwog%2CNEUKO%2CVibes%2CMoonbirds&gradeType=&listing=All+Items"

const cardImages: Record<string, string> = {
  "Luffy OP07-109": "/cards/card-001.png",
  "Monkey D. Luffy - OP07-109 Super Rare": "/cards/card-001.png",
  "Luffy P-001 Promo": "/cards/card-002.png",
  "Monkey D. Luffy - P-001 Promo C2E2": "/cards/card-002.png",
  "Ace Championship": "/cards/card-003.png",
  "Portgas D. Ace - Championship 2023": "/cards/card-003.png",
  "Luffy P-022 Film Red": "/cards/card-004.png",
  "Monkey D. Luffy - P-022 Film Red": "/cards/card-004.png",
  "Shanks P-083 Tournament": "/cards/card-005.png",
  "Shanks - P-083 Tournament Promo": "/cards/card-005.png",
}

export function VaultClient() {
  const [cards, setCards] = useState<VaultCardRow[]>([])
  const [message, setMessage] = useState("")

  const stats = useMemo(
    () => ({
      totalCards: cards.length,
      totalValue: cards.reduce((sum, card) => sum + Number(card.value_usd), 0),
      available: cards.filter((card) => card.status === "available").length,
      reserved: cards.filter((card) => card.status === "reserved").length,
      airdropped: cards.filter((card) => card.status === "airdropped").length,
    }),
    [cards],
  )

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()

    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    async function loadCards() {
      const { data, error } = await supabase
        .from("vault_cards")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        setMessage(error.message)
        return
      }

      setCards(data ?? [])
    }

    const channel = supabase
      .channel(VAULT_CARDS_REALTIME_CHANNEL)
      .on("postgres_changes", VAULT_CARDS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<VaultCardRow>
          setCards((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const nextCard = payload.new as VaultCardRow
        setCards((items) => {
          const existing = items.filter((item) => item.id !== nextCard.id)
          return [nextCard, ...existing].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        })
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void loadCards()
        if (status === "CHANNEL_ERROR") setMessage("Supabase vault realtime subscription failed.")
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
          <VaultIcon className="h-4 w-4" />
          The Pirate Vault
        </div>
        <h1 className="font-display text-4xl uppercase text-foreground sm:text-5xl">Vault</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total Cards" value={stats.totalCards.toString()} />
        <Stat label="Total Vault Value" value={formatUsd(stats.totalValue)} />
        <Stat label="Available" value={stats.available.toString()} />
        <Stat label="Reserved" value={stats.reserved.toString()} />
        <Stat label="Airdropped" value={stats.airdropped.toString()} />
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-secondary p-4 text-sm font-medium text-foreground">
          {message}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {cards.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">Vault is being stocked. Check back soon.</div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="grid gap-4 p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
                <CardImage card={card} />
                <div className="grid gap-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-xl font-extrabold text-foreground">{card.name}</span>
                    <span
                      className={`rounded-md border px-2 py-0.5 font-display text-xs uppercase tracking-wide ${
                        tierClass[card.tier] ?? tierClass.COMMON
                      }`}
                    >
                      {card.tier}
                    </span>
                  </div>
                  <div className="text-muted-foreground">Grade: {card.grade ?? "-"}</div>
                  <div className="text-muted-foreground">Status: {card.status}</div>
                </div>
                <div className="font-heading text-xl font-extrabold text-gold">{formatUsd(Number(card.value_usd))}</div>
              </div>
            ))
          )}
        </div>
        {cards.length > 0 && (
          <div className="border-t border-border p-5 text-center">
            <a
              href={PHYGITALS_URL}
              target="_blank"
              rel="noreferrer"
              className="font-heading text-sm font-extrabold uppercase tracking-wide text-gold hover:text-primary"
            >
              View Full Vault
            </a>
          </div>
        )}
      </div>

    </section>
  )
}

function CardImage({ card }: { card: VaultCardRow }) {
  const image = cardImages[card.name]

  if (!image) {
    return (
      <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-border bg-background text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        No image
      </div>
    )
  }

  return (
    <img
      src={image}
      alt={card.name}
      className="h-28 w-20 rounded-xl border border-border bg-background object-cover"
    />
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="font-heading text-xl font-extrabold text-foreground">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}
