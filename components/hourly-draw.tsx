"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function HourlyDraw() {
  const [secs, setSecs] = useState(50 * 60 + 3)

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 60 * 60 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  return (
    <section className="mx-auto max-w-6xl px-4 py-2">
      <a
        href="/arena"
        className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary sm:flex-row sm:items-center"
      >
        <div className="min-w-0">
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
            Live · Battle every 15–60 min
          </div>
          <p className="text-pretty text-lg font-extrabold leading-snug text-foreground">
            Two holders drawn. <span className="text-primary">Winner takes a grail.</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Last winner: GomuKing → 2d3x…SaME · $20
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            {[pad(h), pad(m), pad(s)].map((v, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="rounded-lg bg-foreground px-2.5 py-1.5 text-lg font-bold text-background tabular-nums">
                  {v}
                </span>
                {i < 2 && <span className="text-muted-foreground">:</span>}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Enter the Arena <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </a>
    </section>
  )
}
