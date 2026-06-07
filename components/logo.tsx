import { Skull } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-gold">
        <Skull className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg uppercase tracking-wide text-foreground">
        One Piece <span className="text-primary">Battle</span>
      </span>
    </span>
  )
}
