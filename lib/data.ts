export const navLinks = [
  { label: "Arena", href: "/#arena" },
  { label: "Duels", href: "/#duels" },
  { label: "Vault", href: "/#vault" },
  { label: "Proof", href: "/#proof" },
  { label: "Airdrops", href: "/#airdrops" },
  { label: "How It Works", href: "/#how" },
  { label: "Dashboard", href: "/dashboard" },
]

export const heroModes = ["1v1 Battle", "Slab Duel", "Slab Arena", "Pirate Vault"]

export const battleTicker: string[] = []

export type Rarity = "MYTHIC" | "LEGENDARY" | "RARE" | "COMMON"

export type Card = {
  name: string
  set: string
  grade: string
  rarity: Rarity
  value: number
}

export const vaultCards: Card[] = []

export const rarityCounts = { ALL: 0, MYTHIC: 0, LEGENDARY: 0, RARE: 0, COMMON: 0 }

export const battleFeed: { winner: string; loser: string; card: string; value: number; ago: string }[] = []

export const arenaFeed: { name: string; set: string; value: number; ago: string }[] = []

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
  { step: "01", title: "Two holders drawn", body: "Every round, two random slab-holders are pulled from a verifiable on-chain snapshot." },
  { step: "02", title: "They battle", body: "The two pirates clash in a live duel and one winner is chosen at random via Solana VRF." },
  { step: "03", title: "Winner takes the prize", body: "The victor wins the round's prize — a live pack opening or a real graded One Piece slab, airdropped instantly." },
]

export const rarityTiers = [
  { tier: "MYTHIC", note: "insured $1k+", color: "var(--gold)" },
  { tier: "LEGENDARY", note: "insured $5k–1k", color: "var(--primary)" },
  { tier: "RARE", note: "insured $300–1k", color: "var(--ocean)" },
  { tier: "COMMON", note: "insured <$300", color: "var(--muted-foreground)" },
]

// ---- Duel (player-vs-player slab wager) ----

export const duelSteps = [
  {
    step: "01",
    title: "Connect & pick your slab",
    body: "Connect your Solana wallet and choose one graded slab from your vault to put on the line.",
  },
  {
    step: "02",
    title: "Set the wager & challenge",
    body: "Match against an opponent of similar slab value, or open a challenge anyone can accept. Both slabs lock in escrow.",
  },
  {
    step: "03",
    title: "Battle & winner takes both",
    body: "Your pirates clash in a live duel decided by Solana VRF. The winner walks away with both slabs, airdropped instantly.",
  },
]

export const duelRules = [
  "You wager your own slab — no treasury, no house. It's player vs player.",
  "Both slabs are held in an on-chain escrow program until the duel resolves.",
  "Wins and losses are 50/50, decided by verifiable Solana VRF — no edge for either side.",
  "Lose and your slab goes to your opponent. Win and you double up. No partial losses.",
]

// ---- Dashboard data ----

export const captain = {
  handle: "Your Crew",
  wallet: "Connect wallet",
  rank: "Unranked",
  joined: "Connect your wallet to begin",
  winRate: 0,
  battles: 0,
  wins: 0,
  losses: 0,
}

export const captainStats = [
  { label: "Slabs Held", value: "—", sub: "in your vault" },
  { label: "Vault Value", value: "—", sub: "insured", accent: true },
  { label: "Battles Won", value: "—", sub: "of 0" },
  { label: "Net P/L", value: "—", sub: "all-time", accent: true },
]

export const myCards: Card[] = []

export const myBattles: { result: string; you: string; vs: string; card: string; value: number; ago: string }[] = []

export const leaderboard: { rank: number; handle: string; title: string; wins: number; value: number; you?: boolean }[] = []
