// King of the Pirates — mock data (backend-ready shapes)
// All values are placeholders for UI only. No wallet, payment, or randomness logic.

export type DuelStatus = "open" | "live" | "settled"

export type Duel = {
  id: string
  stake: 10 | 50
  status: DuelStatus
  challenger: string
  opponent: string | null
  pool: number
  winner: string | null
  ago: string
}

export const liveDuels: Duel[] = [
  { id: "DUEL-7F3A", stake: 50, status: "live", challenger: "9f2K…D4uM", opponent: "Bv7Q…s1Re", pool: 90, winner: null, ago: "now" },
  { id: "DUEL-91C2", stake: 10, status: "open", challenger: "3xKp…Lm0Z", opponent: null, pool: 18, winner: null, ago: "12s ago" },
  { id: "DUEL-22B8", stake: 50, status: "open", challenger: "Az8t…Qh4N", opponent: null, pool: 90, winner: null, ago: "44s ago" },
  { id: "DUEL-08E1", stake: 10, status: "settled", challenger: "Td5w…Rk9P", opponent: "Mq2c…V7bL", pool: 18, winner: "Td5w…Rk9P", ago: "2m ago" },
  { id: "DUEL-5C77", stake: 50, status: "settled", challenger: "Yh1n…Gc3X", opponent: "Wf6r…Up2D", pool: 90, winner: "Wf6r…Up2D", ago: "5m ago" },
]

export const duelTiers = [
  {
    stake: 10,
    name: "$10 Duel",
    tagline: "Fast entry. Quick battle. Winner takes the pot.",
    pool: 18,
    accent: "ocean" as const,
    soon: false,
  },
  {
    stake: 50,
    name: "$50 Duel",
    tagline: "Higher stake. Higher tension. Same provably fair resolution.",
    pool: 90,
    accent: "primary" as const,
    soon: false,
  },
  {
    stake: 0,
    name: "House Duel",
    tagline: "Coming soon. Duel against the vault when house liquidity is enabled.",
    pool: 0,
    accent: "gold" as const,
    soon: true,
  },
]

export const duelFlow = [
  "Connect Wallet",
  "Select $10 or $50 Duel",
  "Create or Accept Challenge",
  "Randomness Resolves Battle",
  "Winner Paid / Proof Posted",
]

// ---- Proof Terminal ----

export type ProofEventType = "Duel" | "Holder Airdrop" | "Card Selection"

export type ProofRecord = {
  eventId: string
  type: ProofEventType
  wallets: string[]
  wager: string
  randomnessProof: string
  resultHash: string
  winner: string
  settlementTx: string
  status: "Settled" | "Pending" | "Resolving"
}

export const proofRecords: ProofRecord[] = [
  {
    eventId: "EVT-0x9A41",
    type: "Duel",
    wallets: ["9f2K…D4uM", "Bv7Q…s1Re"],
    wager: "$50",
    randomnessProof: "vrf:7c1f…a902",
    resultHash: "0x4d8e…11bc",
    winner: "Bv7Q…s1Re",
    settlementTx: "5Ht9…Qz2m",
    status: "Settled",
  },
  {
    eventId: "EVT-0x9A40",
    type: "Holder Airdrop",
    wallets: ["snapshot · 1,284 holders"],
    wager: "—",
    randomnessProof: "vrf:2b6d…ff31",
    resultHash: "0x77a2…90de",
    winner: "Kp3x…Lz8Q",
    settlementTx: "8Jd2…Rk1p",
    status: "Settled",
  },
  {
    eventId: "EVT-0x9A3F",
    type: "Card Selection",
    wallets: ["vault pool · 612 cards"],
    wager: "—",
    randomnessProof: "vrf:9e0a…c7b4",
    resultHash: "0x12fb…44a1",
    winner: "Zoro · Alt Art (EPIC)",
    settlementTx: "2Gh7…Tn5w",
    status: "Settled",
  },
  {
    eventId: "EVT-0x9A3E",
    type: "Duel",
    wallets: ["3xKp…Lm0Z", "Mq2c…V7bL"],
    wager: "$10",
    randomnessProof: "vrf:committed",
    resultHash: "pending",
    winner: "—",
    settlementTx: "—",
    status: "Resolving",
  },
]

// ---- Treasury Vault ----

export const treasuryStats = [
  { label: "Treasury Balance", value: "$48,210", accent: true },
  { label: "Cards Purchased", value: "1,940" },
  { label: "Cards Available", value: "612" },
  { label: "Next Airdrop", value: "41:08", accent: true },
  { label: "Total Airdropped", value: "$31,540" },
  { label: "Last Winner", value: "Kp3x…Lz8Q" },
]

export const treasurySplit = [
  { pct: 50, label: "Buy cards for holder airdrops", color: "var(--primary)" },
  { pct: 50, label: "Buy more cards for the vault", color: "var(--gold)" },
]

export const cardTiers = [
  { tier: "COMMON", note: "$15 cards", color: "var(--muted-foreground)" },
  { tier: "RARE", note: "$20–$25 cards", color: "var(--ocean)" },
  { tier: "EPIC", note: "$50 cards", color: "var(--gold)" },
  { tier: "LEGENDARY", note: "$100+ cards", color: "var(--primary)" },
  { tier: "MYTHIC", note: "grails & premium slabs", color: "var(--foreground)" },
]

// ---- Holder Airdrops ----

export const airdropStats = [
  { label: "Next Airdrop", value: "41:08", accent: true },
  { label: "Eligible Holders", value: "1,284" },
  { label: "Total Tickets", value: "9,640" },
  { label: "Current Prize Pool", value: "$1,250", accent: true },
  { label: "Last Winner", value: "Kp3x…Lz8Q" },
  { label: "Last Card Pulled", value: "Zoro · Alt Art" },
]

export const airdropFlow = [
  "Snapshot holders",
  "Assign tickets by balance",
  "Generate randomness proof",
  "Select winning wallet",
  "Select card from vault",
  "Post proof",
  "Send card claim",
]

// ---- Dashboard Preview ----

export const dashboardPreview = [
  { label: "Active Duels", value: "23", accent: true },
  { label: "Total Volume", value: "$184,920" },
  { label: "Treasury Balance", value: "$48,210", accent: true },
  { label: "Cards in Vault", value: "612" },
  { label: "Next Holder Airdrop", value: "41:08" },
  { label: "Fees Used for Cards", value: "$79,750" },
  { label: "Latest Duel Winner", value: "Bv7Q…s1Re" },
  { label: "Latest Airdrop Winner", value: "Kp3x…Lz8Q" },
]

export const kotpHowSteps = [
  {
    step: "01",
    title: "Duel",
    body: "Players enter $10 or $50 duels. One player creates the duel, another accepts, or later the house can accept.",
  },
  {
    step: "02",
    title: "Randomness",
    body: "The duel winner is selected through a provably fair mechanism. The proof record is posted to the Proof Terminal.",
  },
  {
    step: "03",
    title: "Treasury",
    body: "Fees flow into the treasury. Treasury funds are used to buy real cards and slabs.",
  },
  {
    step: "04",
    title: "Holder Drops",
    body: "Every 30–60 minutes, a supply-weighted holder airdrop selects a wallet and a random card from the vault.",
  },
  {
    step: "05",
    title: "Proof Posted",
    body: "Every duel, winner, card selection, and airdrop is logged with hashes, transactions, and verification data.",
  },
]
