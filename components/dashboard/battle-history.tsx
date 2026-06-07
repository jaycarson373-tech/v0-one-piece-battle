import { myBattles } from "@/lib/data"

export function BattleHistory() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-end justify-between">
        <h3 className="font-heading text-lg font-extrabold text-foreground">My Battles</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</span>
      </div>

      <ul className="mt-5 divide-y divide-border">
        {myBattles.map((b, i) => (
          <li key={i} className="flex items-center gap-3 py-3">
            <span
              className={`flex-none rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                b.result === "WIN"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {b.result}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">
                {b.you} <span className="text-muted-foreground">vs {b.vs}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {b.result === "WIN" ? "Won" : "Lost"} {b.card} · {b.ago}
              </div>
            </div>
            <span
              className={`flex-none font-mono text-sm font-bold ${
                b.result === "WIN" ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {b.result === "WIN" ? "+" : "−"}${b.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
