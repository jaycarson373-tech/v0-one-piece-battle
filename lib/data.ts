export const navLinks = [
  { label: "Live Arena", href: "/arena" },
  { label: "Vault", href: "/#vault" },
  { label: "Earn", href: "/#burn" },
  { label: "Bounties", href: "/#bounties" },
  { label: "Transparency", href: "/#numbers" },
  { label: "How it works", href: "/#how" },
  { label: "Dashboard", href: "/dashboard" },
]

export const tokenStats = {
  symbol: "$BERI",
  price: 0.00428,
  change24h: 18.4,
  marketCap: 4280000,
  fdv: 6010000,
  volume24h: 612400,
  holders: 3942,
  liquidity: 318200,
}

export const heroStats = [
  { value: "$3,328", label: "Net Revenue" },
  { value: "952", label: "Battles Settled" },
  { value: "$16,030", label: "Paid Out in Cards", accent: true },
]

export const heroSubStats = [
  { value: "$6,010", label: "Treasury Value" },
  { value: "78", label: "Cards in Vault" },
  { value: "$10", label: "Entry" },
]

export const heroModes = ["1v1 Battle", "Slab Duel", "Slab Arena", "Pirate Vault", "Bounties"]

export type Rarity = "MYTHIC" | "LEGENDARY" | "RARE" | "COMMON"

export type Card = {
  name: string
  set: string
  grade: string
  rarity: Rarity
  value: number
}

export const vaultCards: Card[] = [
  { name: "Monkey D. Luffy Gear 5 — Alt Art", set: "OP05 #119", grade: "PSA 10", rarity: "MYTHIC", value: 1480 },
  { name: "Shanks — Leader Parallel", set: "OP01 #120", grade: "PSA 10", rarity: "LEGENDARY", value: 940 },
  { name: "Roronoa Zoro — Manga Rare", set: "OP06 #069", grade: "CGC 10", rarity: "LEGENDARY", value: 820 },
  { name: "Boa Hancock — Full Art", set: "OP02 #088", grade: "PSA 9", rarity: "RARE", value: 525 },
  { name: "Trafalgar Law — Parallel", set: "OP01 #047", grade: "CGC 10", rarity: "RARE", value: 410 },
  { name: "Portgas D. Ace — Alt Art", set: "OP02 #013", grade: "PSA 8", rarity: "RARE", value: 360 },
  { name: "Nami — Super Rare", set: "OP01 #016", grade: "PSA 9", rarity: "RARE", value: 290 },
  { name: "Sanji — Full Art", set: "OP03 #056", grade: "PSA 9", rarity: "COMMON", value: 246 },
  { name: "Nico Robin — Holo", set: "OP04 #082", grade: "CGC 10", rarity: "COMMON", value: 210 },
  { name: "Tony Tony Chopper — Holo", set: "OP01 #033", grade: "PSA 9", rarity: "COMMON", value: 190 },
  { name: "Brook — Reverse Foil", set: "OP05 #061", grade: "PSA 8", rarity: "COMMON", value: 165 },
  { name: "Usopp — Holo", set: "OP02 #044", grade: "CGC 9", rarity: "COMMON", value: 140 },
]

export const rarityCounts = { ALL: 78, MYTHIC: 1, LEGENDARY: 2, RARE: 4, COMMON: 71 }

export const battleFeed = [
  { winner: "GomuKing", loser: "lost vs", card: "Trafalgar Law", value: 13, ago: "15m ago" },
  { winner: "RedHair__", loser: "won from", card: "Portgas D. Ace", value: 13, ago: "1h ago" },
  { winner: "SunnyGoes", loser: "won 2024 #047 Sanji Full Art from", card: "Nami", value: 15, ago: "3h ago" },
  { winner: "GrandLineX", loser: "won 2023 #260 Boa Hancock from", card: "Robin", value: 17, ago: "3h ago" },
]

export const arenaFeed = [
  { name: "Nico Robin", set: "$46 def. Chopper", value: 13, ago: "8m ago" },
  { name: "Usopp", set: "$48 def. Brook", value: 16, ago: "22m ago" },
  { name: "Franky", set: "$49 def. Jinbe", value: 13, ago: "44m ago" },
  { name: "Boa Hancock", set: "$48 def. Perona", value: 17, ago: "1h ago" },
]

export const livePayouts = [
  { rank: "#01", name: "Tony Tony Chopper", code: "GRLN · 3m ago", value: 21 },
  { rank: "#02", name: "Usopp", code: "8RYP · 5m ago", value: 16 },
  { rank: "#03", name: "Franky", code: "Byb2 · 9m ago", value: 48, proof: true },
  { rank: "#04", name: "Trafalgar Law", code: "4yRW · 15m ago", value: 13, proof: true },
  { rank: "#05", name: "Portgas D. Ace", code: "GRLN · 18m ago", value: 20 },
  { rank: "#06", name: "Boa Hancock — Full Art", code: "Byb2 · 24m ago", value: 16 },
  { rank: "#07", name: "Nami", code: "8RYP · 28m ago", value: 16, proof: true },
  { rank: "#08", name: "Roronoa Zoro", code: "A9aN · 31m ago", value: 13 },
  { rank: "#09", name: "Sanji Full Art", code: "APDq · 39m ago", value: 15, proof: true },
  { rank: "#10", name: "Shanks — Leader", code: "APDq · 44m ago", value: 37, proof: true },
]

export const burnStats = [
  { value: "$2", label: "Pending", sub: "updates live" },
  { value: "$331", label: "Lifetime Burned", sub: "220 burns" },
  { value: "1.08M $BERI", label: "Tokens Removed", sub: "on-chain" },
  { value: "4,717", label: "SOL Spent", sub: "across all burns" },
]

export const faqs = [
  {
    q: "Are the cards real?",
    a: "Yes. Each card is a real graded One Piece TCG slab held in a bonded vault. Burn the NFT to redeem the physical card shipped to your door.",
  },
  {
    q: "Can I just sell the NFT?",
    a: "Yes. NFTs trade on Magic Eden and Tensor like any other on-chain collectible. You don't have to redeem the physical card.",
  },
  {
    q: "How is randomness handled?",
    a: "Both the coin-flip outcome and the weighted card draw use Solana VRF for verifiable on-chain randomness. No trust required.",
  },
  {
    q: "What's the sell-back window?",
    a: "After you win, you have 12 hours to sell the slab back to the vault for 80% of its insured value. After that, it's yours to keep or list.",
  },
]

export const howSteps = [
  { step: "01", title: "Pay entry", body: "Drop $10 in SOL to enter a battle or spin the vault for a graded One Piece slab." },
  { step: "02", title: "1v1 coin flip", body: "Verifiable VRF coin flip decides the winner instantly — settled on-chain." },
  { step: "03", title: "Winner takes a card", body: "The victor claims the slab as an NFT, redeemable for the physical graded card." },
]

export const rarityTiers = [
  { tier: "MYTHIC", note: "insured $1k+", color: "var(--gold)" },
  { tier: "LEGENDARY", note: "insured $5k–1k", color: "var(--primary)" },
  { tier: "RARE", note: "insured $300–1k", color: "var(--ocean)" },
  { tier: "COMMON", note: "insured <$300", color: "var(--muted-foreground)" },
]

// ---- Dashboard data ----

export const captain = {
  handle: "GomuKing",
  wallet: "7xKp…SaME",
  rank: "Yonko",
  bounty: 1480000000,
  joined: "Joined East Blue · OP01",
  winRate: 58,
  battles: 124,
  wins: 72,
  losses: 52,
}

export const captainStats = [
  { label: "Slabs Held", value: "9", sub: "in your vault" },
  { label: "Vault Value", value: "$3,140", sub: "insured", accent: true },
  { label: "Battles Won", value: "72", sub: "of 124" },
  { label: "Net P/L", value: "+$612", sub: "all-time", accent: true },
]

export const myCards: Card[] = [
  { name: "Roronoa Zoro — Manga Rare", set: "OP06 #069", grade: "CGC 10", rarity: "LEGENDARY", value: 820 },
  { name: "Boa Hancock — Full Art", set: "OP02 #088", grade: "PSA 9", rarity: "RARE", value: 525 },
  { name: "Trafalgar Law — Parallel", set: "OP01 #047", grade: "CGC 10", rarity: "RARE", value: 410 },
  { name: "Nami — Super Rare", set: "OP01 #016", grade: "PSA 9", rarity: "RARE", value: 290 },
  { name: "Nico Robin — Holo", set: "OP04 #082", grade: "CGC 10", rarity: "COMMON", value: 210 },
  { name: "Brook — Reverse Foil", set: "OP05 #061", grade: "PSA 8", rarity: "COMMON", value: 165 },
]

export const myBattles = [
  { result: "WIN", you: "Roronoa Zoro", vs: "RedHair__", card: "Trafalgar Law", value: 410, ago: "12m ago" },
  { result: "WIN", you: "Boa Hancock", vs: "SunnyGoes", card: "Nami — Super Rare", value: 290, ago: "2h ago" },
  { result: "LOSS", you: "Tony Chopper", vs: "GrandLineX", card: "Tony Chopper", value: 190, ago: "5h ago" },
  { result: "WIN", you: "Nico Robin", vs: "BluejamCo", card: "Usopp — Holo", value: 140, ago: "8h ago" },
  { result: "LOSS", you: "Brook", vs: "KuroNeko", card: "Brook — Reverse", value: 165, ago: "1d ago" },
]

export const leaderboard = [
  { rank: 1, handle: "RedHair__", title: "Yonko", wins: 188, value: 14200 },
  { rank: 2, handle: "GomuKing", title: "Yonko", wins: 72, value: 3140, you: true },
  { rank: 3, handle: "SunnyGoes", title: "Supernova", wins: 64, value: 2880 },
  { rank: 4, handle: "GrandLineX", title: "Supernova", wins: 51, value: 2210 },
  { rank: 5, handle: "BluejamCo", title: "Warlord", wins: 44, value: 1760 },
  { rank: 6, handle: "KuroNeko", title: "Warlord", wins: 39, value: 1490 },
]
