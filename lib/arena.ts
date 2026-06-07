// Live Arena data — eligible holders, treasury grails, and battle config.

export type Character = {
  name: string
  epithet: string
  // base power used as the deterministic battle baseline (0-100)
  power: number
  haki: string
}

export type Holder = {
  handle: string
  wallet: string // shortened for display
  character: Character
  slabs: number
}

// Wallets that hold a One Piece slab NFT at snapshot time become eligible combatants.
export const eligibleHolders: Holder[] = []

// The prize on the line for this battle — a real graded slab from the treasury vault.
export type PrizeCard = {
  name: string
  set: string
  grade: string
  rarity: "MYTHIC" | "LEGENDARY" | "RARE" | "COMMON"
  value: number
}

export const featuredPrize: PrizeCard = {
  name: "Trafalgar Law — Parallel",
  set: "OP01 #047",
  grade: "CGC 10",
  rarity: "LEGENDARY",
  value: 410,
}

// The full prize pool the winner's slab is drawn from — a "pack" of slabs held in
// the treasury vault. Each battle deterministically draws one card from this pool
// using the same public seed, so the drop is as verifiable as the matchup itself.
// `weight` controls drop odds (higher = more common).
export type PoolCard = PrizeCard & { weight: number }

export const prizePool: PoolCard[] = []

// Treasury "grails" we are actively hunting / holding.
export const treasuryGrails: { name: string; set: string; grade: string; value: number; status: "Held" | "Hunting" }[] = []

export const arenaStats = [
  { value: "—", label: "Next battle in", accent: true },
  { value: "0", label: "Eligible holders" },
  { value: "—", label: "Treasury value" },
]

// Battle cadence scales with volume.
export const cadenceTiers = [
  { volume: "< $500 / hr", cadence: "Every 60 min" },
  { volume: "$500–2k / hr", cadence: "Every 30 min" },
  { volume: "> $2k / hr", cadence: "Every 15 min" },
]
