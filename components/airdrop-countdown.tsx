"use client"

import { useEffect, useState } from "react"
import { AIRDROP_INTERVAL_MS } from "@/lib/duel-store"

export function AirdropCountdown() {
  const [remaining, setRemaining] = useState(() => getMsUntilNextHour())

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextAt = getNextHourAt()
      const nextRemaining = nextAt - Date.now()

      if (nextRemaining <= 0) {
        setRemaining(AIRDROP_INTERVAL_MS)
        return
      }

      setRemaining(nextRemaining)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return <>{formatCountdown(remaining)}</>
}

function getMsUntilNextHour() {
  return Math.max(0, getNextHourAt() - Date.now())
}

function getNextHourAt() {
  const next = new Date()
  next.setMinutes(0, 0, 0)
  next.setHours(next.getHours() + 1)
  return next.getTime()
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
