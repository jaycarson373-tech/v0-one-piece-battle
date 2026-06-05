import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { BattleFeeds } from "@/components/battle-feeds"
import { HourlyDraw } from "@/components/hourly-draw"
import { BurnSection } from "@/components/burn-section"
import { Vault } from "@/components/vault"
import { LivePayouts } from "@/components/live-payouts"
import { HowItWorks } from "@/components/how-it-works"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <BattleFeeds />
        <HourlyDraw />
        <BurnSection />
        <Vault />
        <LivePayouts />
        <HowItWorks />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
