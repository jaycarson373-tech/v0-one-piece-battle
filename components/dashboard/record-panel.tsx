import { captain } from "@/lib/data"

export function RecordPanel() {
  const total = captain.wins + captain.losses
  const winPct = total > 0 ? Math.round((captain.wins / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-extrabold text-foreground">Battle Record</h3>
        <span className="font-display text-2xl text-primary">{winPct}%</span>
      </div>

      {/* win/loss bar */}
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div className="bg-primary" style={{ width: `${winPct}%` }} aria-hidden="true" />
        <div className="bg-ocean" style={{ width: `${100 - winPct}%` }} aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> {captain.wins} Wins
        </span>
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          {captain.losses} Losses <span className="h-2.5 w-2.5 rounded-full bg-ocean" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-secondary p-4 text-center">
          <div className="font-display text-xl text-foreground">{total}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Battles</div>
        </div>
        <div className="rounded-xl border border-border bg-secondary p-4 text-center">
          <div className="font-display text-xl text-gold">{captain.rank}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Rank</div>
        </div>
      </div>
    </div>
  )
}
