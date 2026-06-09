"use client"

import { useEffect, useState } from "react"
import { AIRDROP_INTERVAL_MS } from "@/lib/duel-store"

export function AirdropCountdown() {
  const [remaining, setRemaining] = useState(AIRDROP_INTERVAL_MS)

  useEffect(() => {
    let nextAt = Date.now() + AIRDROP_INTERVAL_MS

    const interval = window.setInterval(() => {
      const nextRemaining = nextAt - Date.now()

      if (nextRemaining <= 0) {
        nextAt = Date.now() + AIRDROP_INTERVAL_MS
        setRemaining(AIRDROP_INTERVAL_MS)
        return
      }

      setRemaining(nextRemaining)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return <>{formatCountdown(remaining)}</>
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
