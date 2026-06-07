import { myCards, type Rarity } from "@/lib/data"

const rarityColor: Record<Rarity, string> = {
  MYTHIC: "var(--gold)",
  LEGENDARY: "var(--primary)",
  RARE: "var(--ocean)",
  COMMON: "var(--muted-foreground)",
}

export function MyVault() {
  const total = myCards.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-end justify-between">
        <h3 className="font-heading text-lg font-extrabold text-foreground">My Slabs</h3>
        <span className="font-mono text-sm font-bold text-gold">${total.toLocaleString()} insured</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {myCards.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3"
          >
            <span
              className="h-10 w-1.5 flex-none rounded-full"
              style={{ backgroundColor: rarityColor[c.rarity] }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-heading text-sm font-extrabold text-foreground">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">
                {c.set} · {c.grade}
              </div>
            </div>
            <span className="flex-none font-mono text-sm font-bold text-foreground">${c.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
