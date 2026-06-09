import { HolderAirdrops } from "@/components/holder-airdrops"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function AirdropsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HolderAirdrops />
      </main>
      <SiteFooter />
    </div>
  )
}
