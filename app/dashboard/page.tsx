import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CaptainHeader } from "@/components/dashboard/captain-header"
import { RecordPanel } from "@/components/dashboard/record-panel"
import { MyVault } from "@/components/dashboard/my-vault"
import { BattleHistory } from "@/components/dashboard/battle-history"
import { Leaderboard } from "@/components/dashboard/leaderboard"
import { HolderAirdropPanel } from "@/components/dashboard/holder-airdrop-panel"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <CaptainHeader />
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <MyVault />
              <BattleHistory />
            </div>
            <div className="space-y-6">
              <HolderAirdropPanel />
              <RecordPanel />
              <Leaderboard />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
