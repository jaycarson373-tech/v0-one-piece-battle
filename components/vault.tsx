"use client"

import { useState } from "react"
import { vaultCards, rarityCounts, type Rarity } from "@/lib/data"

type Filter = "ALL" | Rarity

const rarityStyles: Record<Rarity, string> = {
  MYTHIC: "bg-gold text-gold-foreground",
  LEGENDARY: "bg-primary text-primary-foreground",
  RARE: "bg-ocean text-white",
  COMMON: "bg-secondary text-muted-foreground",
}

const filters: Filter[] = ["ALL", "MYTHIC", "LEGENDARY", "RARE", "COMMON"]

export function Vault() {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [sort, setSort] = useState("value-desc")

  let cards = filter === "ALL" ? vaultCards : vaultCards.filter((c) => c.rarity === filter)
  cards = [...cards].sort((a, b) => {
    if (sort === "value-asc") return a.value - b.value
    if (sort === "value-desc") return b.value - a.value
    const order = { MYTHIC: 0, LEGENDARY: 1, RARE: 2, COMMON: 3 }
    return order[a.rarity] - order[b.rarity]
  })

  return (
    <section id="vault" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-3xl font-extrabold text-foreground">
            The Vault
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Live
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Graded One Piece cards held on-chain, publicly verifiable. Click any card to see the full slab.
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cards</div>
            <div className="font-heading text-xl font-extrabold text-foreground">78</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="font-heading text-xl font-extrabold text-foreground">$6,010</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = rarityCounts[f]
            const disabled = f !== "ALL" && count === 0
            return (
              <button
                key={f}
                disabled={disabled}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  filter === f
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {f} {count}
              </button>
            )
          })}
        </div>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-semibold text-foreground"
          >
            <option value="value-desc">Value ↓</option>
            <option value="value-asc">Value ↑</option>
            <option value="rarity">Rarity</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.name}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
          >
            <div className="relative flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span
                className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rarityStyles[c.rarity]}`}
              >
                {c.rarity}
              </span>
              <span className="absolute right-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[9px] font-bold text-foreground">
                {c.grade}
              </span>
              <span className="px-3 text-center font-heading text-sm font-extrabold leading-tight text-muted-foreground">
                {c.name}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{c.name}</span>
                <span className="block text-[11px] text-muted-foreground">{c.set}</span>
              </span>
              <span className="shrink-0 rounded-lg bg-secondary px-2 py-1 text-sm font-bold text-foreground">
                ${c.value}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          Show 70 more cards
        </button>
      </div>
    </section>
  )
}
