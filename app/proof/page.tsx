import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ProofClient } from "@/components/proof-client"

export default function ProofPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ProofClient />
      </main>
      <SiteFooter />
    </div>
  )
}
