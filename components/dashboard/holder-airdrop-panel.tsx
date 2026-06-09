"use client"

import { useEffect, useState } from "react"
import { Gift } from "lucide-react"
import { AIRDROP_INTERVAL_MS, shortWallet } from "@/lib/duel-store"
import { type AirdropState, readAirdropState, runHolderAirdropNow } from "@/lib/holder-airdrop"
import { formatCountdown } from "@/components/airdrop-countdown"

export function HolderAirdropPanel() {
  const [state, setState] = useState<AirdropState>(() => ({
    lastWinnerWallet: "",
    lastCardPulled: "",
    nextAirdropAt: new Date(Date.now() + AIRDROP_INTERVAL_MS).toISOString(),
    lastEventId: "",
  }))
  const [now, setNow] = useState(Date.now())
  const [running, setRunning] = useState(false)

  const nextAirdropMs = new Date(state.nextAirdropAt).getTime()
  const countdown = Math.max(0, nextAirdropMs - now)

  useEffect(() => {
    setState(readAirdropState())
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!running && countdown === 0) {
      void runHourlyAirdrop()
    }
  }, [countdown, running])

  async function runHourlyAirdrop() {
    setRunning(true)

    try {
      await runHolderAirdropNow()
      setState(readAirdropState())
    } catch {
      setState((current) => ({
        ...current,
        nextAirdropAt: new Date(Date.now() + AIRDROP_INTERVAL_MS).toISOString(),
      }))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-extrabold text-foreground">Holder Airdrop</h3>
          <p className="mt-1 text-xs text-muted-foreground">Supply weighted: 100K tokens = 1 ticket</p>
        </div>
        <Gift className="h-5 w-5 text-gold" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Last Winner" value={state.lastWinnerWallet ? shortWallet(state.lastWinnerWallet) : "-"} />
        <Metric label="Last Card Pulled" value={state.lastCardPulled || "-"} />
        <Metric label="Next Airdrop" value={formatCountdown(countdown)} />
        <Metric label="Last Event" value={state.lastEventId || "-"} />
      </div>
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

