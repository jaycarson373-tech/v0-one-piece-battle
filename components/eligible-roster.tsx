import { Users } from "lucide-react"
import { eligibleHolders } from "@/lib/arena"
import { EmptyState } from "@/components/empty-state"

export function EligibleRoster() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-xl font-extrabold text-foreground">Eligible combatants</h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          snapshot · {eligibleHolders.length} wallets
        </span>
      </div>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Any wallet holding a One Piece slab NFT at snapshot time is entered. The character attached to that
        wallet is the pirate it fights with. More slabs held = more entries in the draw.
      </p>

      {eligibleHolders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No combatants yet"
          description="Once wallets start holding One Piece slabs, the eligible roster for each snapshot will show up here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {eligibleHolders.map((h) => (
            <div key={h.handle} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-heading text-base font-extrabold text-primary">
                {h.character.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="mt-2 line-clamp-1 font-heading text-sm font-extrabold text-foreground">
                {h.character.name}
              </div>
              <div className="line-clamp-1 text-[11px] text-muted-foreground">{h.character.epithet}</div>
              <div className="mt-2 flex items-center justify-center gap-1 font-mono text-[10px] text-muted-foreground">
                {h.wallet}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 border-t border-border pt-2 text-[11px]">
                <span className="text-muted-foreground">
                  PWR <span className="font-bold text-foreground">{h.character.power}</span>
                </span>
                <span className="text-border">·</span>
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">{h.slabs}</span> slabs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
