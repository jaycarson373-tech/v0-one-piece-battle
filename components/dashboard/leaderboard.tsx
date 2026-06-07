import { Crown } from "lucide-react"
import { leaderboard } from "@/lib/data"

export function Leaderboard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-gold" />
        <h3 className="font-heading text-lg font-extrabold text-foreground">Pirate Rankings</h3>
      </div>

      <ul className="mt-5 space-y-2">
        {leaderboard.map((p) => (
          <li
            key={p.rank}
            className={`flex items-center gap-3 rounded-xl border p-3 ${
              p.you ? "border-gold bg-gold/10" : "border-border bg-secondary"
            }`}
          >
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-full font-display text-sm ${
                p.rank === 1 ? "bg-gold text-gold-foreground" : "bg-card text-foreground"
              }`}
            >
              {p.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-foreground">
                {p.handle}
                {p.you && <span className="ml-1.5 text-[10px] font-bold uppercase text-gold">You</span>}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {p.title} · {p.wins} wins
              </div>
            </div>
            <span className="flex-none font-mono text-sm font-bold text-foreground">
              ${p.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
