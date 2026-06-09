import { LayoutDashboard, ArrowUpRight } from "lucide-react"
import { dashboardPreview } from "@/lib/kotp"

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden border-b border-border">
      {/* minimal ship backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bg/ship-solo.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/96 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ocean">
              <LayoutDashboard className="h-4 w-4" /> Live Dashboard
            </div>
            <h2 className="max-w-2xl text-balance font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
              The whole game, at a glance.
            </h2>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            Open Dashboard <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dashboardPreview.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className={`mt-3 font-heading text-2xl font-extrabold ${s.accent ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
