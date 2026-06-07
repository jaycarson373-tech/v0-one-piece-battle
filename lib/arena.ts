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
export const eligibleHolders: Holder[] = [
  {
    handle: "GomuKing",
    wallet: "2d3x…SaME",
    slabs: 4,
    character: { name: "Monkey D. Luffy", epithet: "Gear 5 · Sun God Nika", power: 96, haki: "Advanced Conqueror's" },
  },
  {
    handle: "RedHair__",
    wallet: "9RYp…4vQ2",
    slabs: 2,
    character: { name: "Shanks", epithet: "Red-Haired Emperor", power: 94, haki: "Conqueror's" },
  },
  {
    handle: "SunnyGoes",
    wallet: "Byb2…k7Lp",
    slabs: 3,
    character: { name: "Roronoa Zoro", epithet: "King of Hell", power: 90, haki: "Advanced Armament" },
  },
  {
    handle: "GrandLineX",
    wallet: "4yRW…Dq9a",
    slabs: 5,
    character: { name: "Trafalgar Law", epithet: "Surgeon of Death", power: 86, haki: "Observation" },
  },
  {
    handle: "PoneglyphPete",
    wallet: "APDq…7zXr",
    slabs: 1,
    character: { name: "Nico Robin", epithet: "Devil Child", power: 78, haki: "Armament" },
  },
  {
    handle: "ThrillBill",
    wallet: "8RYP…2mNk",
    slabs: 2,
    character: { name: "Portgas D. Ace", epithet: "Fire Fist", power: 88, haki: "Conqueror's" },
  },
  {
    handle: "SnakeCharm",
    wallet: "A9aN…q4Ws",
    slabs: 1,
    character: { name: "Boa Hancock", epithet: "Pirate Empress", power: 84, haki: "Conqueror's" },
  },
  {
    handle: "WingsOfFire",
    wallet: "GRLN…Sa3x",
    slabs: 3,
    character: { name: "Sabo", epithet: "Flame Emperor", power: 85, haki: "Advanced Armament" },
  },
  {
    handle: "CookFlame",
    wallet: "5kPq…9LtV",
    slabs: 1,
    character: { name: "Sanji", epithet: "Black Leg · Ifrit Jambe", power: 82, haki: "Observation" },
  },
  {
    handle: "WanoBlade",
    wallet: "3hYz…Mn8c",
    slabs: 2,
    character: { name: "Yamato", epithet: "Guardian of Wano", power: 87, haki: "Advanced Armament" },
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

// The full prize pool the winner's slab is drawn from — a "pack" of slabs held in
// the treasury vault. Each battle deterministically draws one card from this pool
// using the same public seed, so the drop is as verifiable as the matchup itself.
// `weight` controls drop odds (higher = more common).
export type PoolCard = PrizeCard & { weight: number }

export const prizePool: PoolCard[] = [
  { name: "Buggy — Common", set: "OP01 #078", grade: "PSA 9", rarity: "COMMON", value: 35, weight: 40 },
  { name: "Nami — Uncommon", set: "OP01 #016", grade: "CGC 9.5", rarity: "COMMON", value: 55, weight: 34 },
  { name: "Usopp — Rare", set: "OP03 #053", grade: "PSA 10", rarity: "RARE", value: 90, weight: 24 },
  { name: "Sanji — Black Leg", set: "OP01 #024", grade: "CGC 10", rarity: "RARE", value: 140, weight: 18 },
  { name: "Nico Robin — Full Art", set: "OP02 #088", grade: "PSA 10", rarity: "RARE", value: 190, weight: 14 },
  { name: "Portgas D. Ace — Fire Fist", set: "OP02 #013", grade: "CGC 10", rarity: "LEGENDARY", value: 310, weight: 9 },
  { name: "Trafalgar Law — Parallel", set: "OP01 #047", grade: "CGC 10", rarity: "LEGENDARY", value: 410, weight: 6 },
  { name: "Roronoa Zoro — Manga Rare", set: "OP06 #069", grade: "CGC 10", rarity: "LEGENDARY", value: 820, weight: 3 },
  { name: "Shanks — Leader Parallel", set: "OP01 #120", grade: "PSA 10", rarity: "MYTHIC", value: 940, weight: 2 },
  { name: "Monkey D. Luffy — Gear 5 Alt", set: "OP05 #119", grade: "PSA 10", rarity: "MYTHIC", value: 1480, weight: 1 },
]

// Treasury "grails" we are actively hunting / holding.
export const treasuryGrails = [
  { name: "Monkey D. Luffy — Gear 5 Alt Art", set: "OP05 #119", grade: "PSA 10", value: 1480, status: "Held" as const },
  { name: "Shanks — Leader Parallel", set: "OP01 #120", grade: "PSA 10", value: 940, status: "Held" as const },
  { name: "Roronoa Zoro — Manga Rare", set: "OP06 #069", grade: "CGC 10", value: 820, status: "Held" as const },
  { name: "Kaido — Special Art SEC", set: "OP04 #119", grade: "PSA 10", value: 1650, status: "Hunting" as const },
  { name: "Gol D. Roger — Manga Rare", set: "OP09 #119", grade: "PSA 10", value: 2100, status: "Hunting" as const },
  { name: "Boa Hancock — Full Art", set: "OP02 #088", grade: "PSA 9", value: 525, status: "Held" as const },
]

export const arenaStats = [
  { value: "15m", label: "Next battle in", accent: true },
  { value: "10", label: "Eligible holders" },
  { value: "$6,010", label: "Treasury value" },
]

// Battle cadence scales with volume.
export const cadenceTiers = [
  { volume: "< $500 / hr", cadence: "Every 60 min" },
  { volume: "$500–2k / hr", cadence: "Every 30 min" },
  { volume: "> $2k / hr", cadence: "Every 15 min" },
]
