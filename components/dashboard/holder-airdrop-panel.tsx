"use client"

import { useEffect, useMemo, useState } from "react"
import { Gift } from "lucide-react"
import { AIRDROP_INTERVAL_MS, shortWallet } from "@/lib/duel-store"
import { type AirdropState, readAirdropState, runHolderAirdropNow } from "@/lib/holder-airdrop"

export function HolderAirdropPanel() {
  const [state, setState] = useState<AirdropState>(() => ({
    lastWinnerWallet: "",
    lastCardPulled: "",
    nextAirdropAt: new Date(Date.now() + AIRDROP_INTERVAL_MS).toISOString(),
    lastEventId: "",
  }))
  const [now, setNow] = useState(Date.now())
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState("")

  const nextAirdropMs = useMemo(() => new Date(state.nextAirdropAt).getTime(), [state.nextAirdropAt])
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
      void runAirdrop()
    }
  }, [countdown, running])

  async function runAirdrop() {
    setRunning(true)
    setMessage("DRY_RUN=true: running holder snapshot and Switchboard VRF selection.")

    try {
      const result = await runHolderAirdropNow()
      setState(readAirdropState())
      setMessage(`Airdrop proof posted: ${shortWallet(result.winnerWallet)} won ${result.cardName}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Holder airdrop failed.")
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

      {message && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{message}</p>}

      <button
        type="button"
        onClick={() => runAirdrop()}
        disabled={running}
        className="mt-5 w-full rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {running ? "Running Airdrop" : "Run Airdrop Now"}
      </button>
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

function formatCountdown(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
