import { Vault, Target } from "lucide-react"
import { treasuryGrails } from "@/lib/arena"

export function TreasuryGrails() {
  return (
    <section id="treasury" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-center gap-2">
        <Vault className="h-5 w-5 text-gold" />
        <h2 className="font-heading text-xl font-extrabold text-foreground">Treasury & grails</h2>
      </div>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Entry fees and pack sales build a treasury of real graded slabs. Held grails are prizes in the arena;
        hunting grails are the chase cards we&apos;re actively buying for future battles.
      </p>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {treasuryGrails.map((g, i) => (
          <div
            key={g.name}
            className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="line-clamp-1 font-semibold text-foreground">{g.name}</div>
              <div className="font-mono text-xs text-muted-foreground">
                {g.set} · {g.grade}
              </div>
            </div>
            <div className="flex flex-none items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  g.status === "Held"
                    ? "bg-ocean/10 text-ocean"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {g.status === "Hunting" && <Target className="h-3 w-3" />}
                {g.status}
              </span>
              <span className="font-heading text-base font-extrabold text-foreground">${g.value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
