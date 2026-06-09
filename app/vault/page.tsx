import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { VaultClient } from "@/components/vault-client"

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <VaultClient />
      </main>
      <SiteFooter />
    </div>
  )
}
