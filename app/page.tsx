import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { BattleTicker } from "@/components/battle-ticker"
import { BattleFeeds } from "@/components/battle-feeds"
import { HourlyDraw } from "@/components/hourly-draw"
import { Vault } from "@/components/vault"
import { HowItWorks } from "@/components/how-it-works"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <BattleTicker />
        <BattleFeeds />
        <HourlyDraw />
        <Vault />
        <HowItWorks />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
