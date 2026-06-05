import { ArrowUpRight } from "lucide-react"
import { battleFeed, arenaFeed } from "@/lib/data"

function FeedCard({
  title,
  cta,
  children,
}: {
  title: string
  cta: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-sm font-extrabold uppercase tracking-wider text-foreground">{title}</h3>
        <a href="#" className="text-xs font-semibold text-primary hover:underline">
          {cta} →
        </a>
      </div>
      <ul className="divide-y divide-border">{children}</ul>
      <button className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary">
        See more (10 more)
      </button>
    </div>
  )
}

export function BattleFeeds() {
  return (
    <section id="battles" className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-4 lg:grid-cols-2">
        <FeedCard title="1v1 Battles" cta="Play a 1v1">
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

        <FeedCard title="Slab Arena" cta="Enter the Arena">
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
