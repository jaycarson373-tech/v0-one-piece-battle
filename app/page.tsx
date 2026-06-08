import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { LiveDuelArena } from "@/components/live-duel-arena"
import { ProofTerminal } from "@/components/proof-terminal"
import { TreasuryVault } from "@/components/treasury-vault"
import { HolderAirdrops } from "@/components/holder-airdrops"
import { HowItWorks } from "@/components/how-it-works"
import { DashboardPreview } from "@/components/dashboard-preview"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <LiveDuelArena />
        <ProofTerminal />
        <TreasuryVault />
        <HolderAirdrops />
        <HowItWorks />
        <DashboardPreview />
      </main>
      <SiteFooter />
    </div>
  )
}
