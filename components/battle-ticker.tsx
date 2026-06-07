import { Swords } from "lucide-react"
import { battleTicker } from "@/lib/data"

export function BattleTicker() {
  if (battleTicker.length === 0) return null
  const items = [...battleTicker, ...battleTicker]
  return (
    <div className="relative flex items-center overflow-hidden border-y-2 border-primary/40 bg-primary/10 py-2.5">
      <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-primary/40 bg-primary px-3 py-1 text-[11px] font-display uppercase tracking-widest text-primary-foreground">
        <span className="live-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
        Live K.O. Feed
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap pl-8">
          {items.map((line, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Swords className="h-3.5 w-3.5 text-primary" />
              {line}
              <span className="text-gold">★</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
