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
// DEMO ROSTER — replaced at launch by a live on-chain snapshot of slab holders.
export const eligibleHolders: Holder[] = [
  {
    handle: "@gomu_king",
    wallet: "2d3x…SaME",
    slabs: 4,
    character: { name: "Monkey D. Luffy", epithet: "Straw Hat", power: 96, haki: "Conqueror's" },
  },
  {
    handle: "@santoryu",
    wallet: "9f1a…Zoro",
    slabs: 3,
    character: { name: "Roronoa Zoro", epithet: "Pirate Hunter", power: 92, haki: "Armament" },
  },
  {
    handle: "@blackleg",
    wallet: "7c4b…Sanj",
    slabs: 2,
    character: { name: "Vinsmoke Sanji", epithet: "Black Leg", power: 88, haki: "Observation" },
  },
  {
    handle: "@cat_burglar",
    wallet: "4e8d…Nami",
    slabs: 2,
    character: { name: "Nami", epithet: "Cat Burglar", power: 74, haki: "None" },
  },
  {
    handle: "@soul_king",
    wallet: "1a9f…Broo",
    slabs: 1,
    character: { name: "Brook", epithet: "Soul King", power: 79, haki: "Armament" },
  },
  {
    handle: "@god_usopp",
    wallet: "6b2c…Usop",
    slabs: 1,
    character: { name: "Usopp", epithet: "God Usopp", power: 71, haki: "Observation" },
  },
  {
    handle: "@cyborg_franky",
    wallet: "8d5e…Fran",
    slabs: 2,
    character: { name: "Franky", epithet: "Iron Pirate", power: 82, haki: "None" },
  },
  {
    handle: "@chopper_md",
    wallet: "3f7a…Chop",
    slabs: 1,
    character: { name: "Tony Tony Chopper", epithet: "Cotton Candy Lover", power: 68, haki: "None" },
  },
  {
    handle: "@devil_child",
    wallet: "5c1b…Robi",
    slabs: 3,
    character: { name: "Nico Robin", epithet: "Devil Child", power: 84, haki: "Observation" },
  },
  {
    handle: "@fire_fist",
    wallet: "0a4d…Aces",
    slabs: 5,
    character: { name: "Portgas D. Ace", epithet: "Fire Fist", power: 90, haki: "Conqueror's" },
  },
]

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

// The slab pool the winner's prize is drawn from — a "pack" of slabs held in
// the treasury vault. Each battle deterministically draws one card from this pool
// using the same public seed, so the drop is as verifiable as the matchup itself.
// `weight` controls drop odds (higher = more common).
export type PoolCard = PrizeCard & { weight: number }

export const prizePool: PoolCard[] = [
  { name: "Monkey D. Luffy — Manga Rare", set: "OP01 #120", grade: "CGC 10", rarity: "MYTHIC", value: 1200, weight: 1 },
  { name: "Trafalgar Law — Parallel", set: "OP01 #047", grade: "CGC 10", rarity: "LEGENDARY", value: 410, weight: 3 },
  { name: "Roronoa Zoro — Alt Art", set: "OP02 #093", grade: "CGC 9.5", rarity: "LEGENDARY", value: 360, weight: 3 },
  { name: "Nami — Super Rare", set: "OP01 #016", grade: "CGC 9.5", rarity: "RARE", value: 140, weight: 6 },
  { name: "Sanji — Super Rare", set: "OP03 #056", grade: "CGC 9", rarity: "RARE", value: 120, weight: 6 },
  { name: "Usopp — Rare", set: "OP02 #028", grade: "CGC 9", rarity: "COMMON", value: 45, weight: 10 },
  { name: "Chopper — Rare", set: "OP01 #033", grade: "CGC 9", rarity: "COMMON", value: 40, weight: 10 },
]

// Treasury "grails" we are actively hunting / holding.
export const treasuryGrails: { name: string; set: string; grade: string; value: number; status: "Held" | "Hunting" }[] = []

export const arenaStats = [
  { value: "15 min", label: "Next battle in", accent: true },
  { value: "10", label: "Eligible holders" },
  { value: "$2.3k", label: "Treasury value" },
]

// Battle cadence scales with volume.
export const cadenceTiers = [
  { volume: "< $500 / hr", cadence: "Every 60 min" },
  { volume: "$500–2k / hr", cadence: "Every 30 min" },
  { volume: "> $2k / hr", cadence: "Every 15 min" },
]
