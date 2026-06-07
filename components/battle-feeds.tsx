import { ArrowUpRight, Swords, Inbox } from "lucide-react"
import { battleFeed, arenaFeed } from "@/lib/data"
import { EmptyState } from "@/components/empty-state"

function FeedCard({
  title,
  cta,
  empty,
  children,
}: {
  title: string
  cta: string
  empty: boolean
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <h3 className="flex items-center gap-2 font-display text-base uppercase tracking-wide text-foreground">
          <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" />
          {title}
        </h3>
        <a href="#" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
          {cta} →
        </a>
      </div>
      {empty ? (
        <EmptyState
          icon={Inbox}
          title="No battles yet"
          description="Results will appear here the moment the first battle is settled on-chain."
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <ul className="divide-y divide-border">{children}</ul>
      )}
    </div>
  )
}

export function BattleFeeds() {
  return (
    <section id="battles" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center gap-3">
        <Swords className="h-6 w-6 text-primary" />
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground sm:text-3xl">
          The Battlefield
        </h2>
        <span className="ml-auto rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          Live results
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <FeedCard title="1v1 Battles" cta="Play a 1v1" empty={battleFeed.length === 0}>
          {battleFeed.map((b, i) => (
            <li key={i} className="flex items-center justify-between gap-2 py-2.5 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="font-mono text-xs text-gold">●</span>
                <span className="truncate text-foreground">
                  <span className="font-semibold">{b.winner}</span>{" "}
                  <span className="text-muted-foreground">{b.loser}</span>{" "}
                  <span className="font-medium">{b.card}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-semibold text-foreground">${b.value}</span>
                <a href="#" className="hidden items-center text-xs text-primary hover:underline sm:inline-flex">
                  proof <ArrowUpRight className="h-3 w-3" />
                </a>
                <span className="w-14 text-right text-xs text-muted-foreground">{b.ago}</span>
              </span>
            </li>
          ))}
        </FeedCard>

        <FeedCard title="Slab Arena" cta="Enter the Arena" empty={arenaFeed.length === 0}>
          {arenaFeed.map((a, i) => (
            <li key={i} className="flex items-center justify-between gap-2 py-2.5 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="font-mono text-xs text-ocean">●</span>
                <span className="truncate text-foreground">
                  <span className="font-semibold">{a.name}</span>{" "}
                  <span className="text-muted-foreground">{a.set}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-semibold text-foreground">${a.value}</span>
                <a href="#" className="hidden items-center text-xs text-primary hover:underline sm:inline-flex">
                  proof <ArrowUpRight className="h-3 w-3" />
                </a>
                <span className="w-14 text-right text-xs text-muted-foreground">{a.ago}</span>
              </span>
            </li>
          ))}
        </FeedCard>
      </div>
    </section>
  )
}
