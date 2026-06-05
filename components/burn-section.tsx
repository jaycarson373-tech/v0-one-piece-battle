import { Copy, ExternalLink } from "lucide-react"
import { burnStats } from "@/lib/data"

const points = [4, 6, 5, 9, 8, 14, 18, 17, 26, 33, 30, 44, 58, 70, 90, 121]

function Sparkline() {
  const max = Math.max(...points)
  const w = 600
  const h = 120
  const step = w / (points.length - 1)
  const coords = points.map((p, i) => [i * step, h - (p / max) * (h - 10) - 5])
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ")
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill="var(--primary)" opacity="0.1" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function BurnSection() {
  return (
    <section id="burn" className="mx-auto max-w-6xl px-4 py-12">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1">Token buy &amp; burn</span>
              <span className="rounded-full bg-secondary px-2.5 py-1">3.5% of every paid entry</span>
            </div>
            <h2 className="text-balance font-heading text-3xl font-extrabold leading-tight text-foreground">
              Every battle buys and burns <span className="text-primary">$BERI</span>.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              A configurable slice of every paid entry is set aside, swapped to $BERI on the open market, and
              burned on-chain. The pending counter updates as pirates play; every burn is a public Solana
              transaction.
            </p>
            <a href="#" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
              See burn history →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {burnStats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-secondary px-4 py-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-1 font-heading text-xl font-extrabold text-foreground">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-6 pb-2 pt-5 sm:px-8">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Cumulative $BERI burned</span>
            <span className="text-primary">121K</span>
          </div>
          <Sparkline />
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border bg-secondary px-6 py-4 text-sm sm:flex-row sm:items-center sm:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-xs text-muted-foreground">CA</span>
            <span className="truncate font-mono text-xs text-foreground">
              BeRi9t1ahSvm91CSa8ASqvenmxxQn2WU5VeNhdmebeRi
            </span>
            <button aria-label="Copy contract address" className="text-muted-foreground hover:text-foreground">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <a href="#" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Chart <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
