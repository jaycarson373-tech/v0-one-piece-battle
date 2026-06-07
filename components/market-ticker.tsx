"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Copy, Check } from "lucide-react"
import { tokenStats } from "@/lib/data"

const CONTRACT = "BeRi5oLpiRatEArenAxXxOnEpiEcE111111111111"

function fmtUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

export function MarketTicker() {
  // gently jitter the price so the bar feels live
  const [price, setPrice] = useState(tokenStats.price)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => {
        const drift = p * (Math.random() * 0.006 - 0.003)
        return Math.max(0.00001, p + drift)
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const mcap = (price / tokenStats.price) * tokenStats.marketCap

  const items = [
    { label: "Price", value: `$${price.toFixed(5)}` },
    { label: "Market Cap", value: fmtUsd(mcap), accent: true },
    { label: "24h Vol", value: fmtUsd(tokenStats.volume24h) },
    { label: "Liquidity", value: fmtUsd(tokenStats.liquidity) },
    { label: "Holders", value: tokenStats.holders.toLocaleString() },
  ]

  function copy() {
    navigator.clipboard?.writeText(CONTRACT)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-extrabold text-gold-foreground">
            B
          </span>
          <span className="font-heading text-sm font-extrabold text-foreground">{tokenStats.symbol}</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-ocean/15 px-1.5 py-0.5 text-[11px] font-bold text-ocean">
            <TrendingUp className="h-3 w-3" />+{tokenStats.change24h}%
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-1">
          {items.map((it) => (
            <div key={it.label} className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {it.label}
              </span>
              <span
                className={`font-mono text-sm font-bold tabular-nums ${
                  it.accent ? "text-primary" : "text-foreground"
                }`}
              >
                {it.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy contract address"
        >
          {CONTRACT.slice(0, 4)}…{CONTRACT.slice(-4)}
          {copied ? <Check className="h-3 w-3 text-ocean" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    </div>
  )
}
