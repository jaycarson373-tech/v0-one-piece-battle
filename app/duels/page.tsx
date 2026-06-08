import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { DuelsClient } from "@/components/duels-client"

export default function DuelsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <DuelsClient />
      </main>
      <SiteFooter />
    </div>
  )
}
