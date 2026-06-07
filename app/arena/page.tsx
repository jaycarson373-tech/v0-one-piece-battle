import { SiteHeader } from "@/components/site-header"
import { ArenaHero } from "@/components/arena-hero"
import { LiveArena } from "@/components/live-arena"
import { EligibleRoster } from "@/components/eligible-roster"
import { ProvablyFair } from "@/components/provably-fair-section"
import { TreasuryGrails } from "@/components/treasury-grails"
import { SiteFooter } from "@/components/site-footer"
import { Swords } from "lucide-react"

export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ArenaHero />
        <LiveArena />
        <EligibleRoster />
        <ProvablyFair />
        <TreasuryGrails />

        {/* Duels teaser */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed border-border bg-secondary p-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-foreground">Duels are coming next</h3>
                <p className="text-sm text-muted-foreground">
                  Pick your opponent and wager slab-for-slab, head to head. Arena runs while we finish it.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">
              In development
            </span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
