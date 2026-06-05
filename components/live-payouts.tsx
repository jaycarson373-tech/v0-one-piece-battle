import { ArrowUpRight } from "lucide-react"
import { livePayouts } from "@/lib/data"

export function LivePayouts() {
  return (
    <section id="numbers" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Live tape
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Latest payouts · 15
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {livePayouts.map((p) => (
            <li key={p.rank} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs font-bold text-muted-foreground">{p.rank}</span>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{p.name}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{p.code}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {p.proof && (
                  <a
                    href="#"
                    className="hidden items-center gap-0.5 rounded-md border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-secondary sm:inline-flex"
                  >
                    Proof <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                <span className="font-heading text-base font-extrabold text-foreground">${p.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
