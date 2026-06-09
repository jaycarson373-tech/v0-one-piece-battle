// King of the Pirates — mock data (backend-ready shapes)
// All values are placeholders for UI only. No wallet, payment, or randomness logic.

export type DuelStatus = "open" | "live" | "settled"

export type Duel = {
  id: string
  stake: 10
  status: DuelStatus
  challenger: string
  opponent: string | null
  pool: number
  winner: string | null
  ago: string
}

export const liveDuels: Duel[] = [
  { id: "DUEL-7F3A", stake: 10, status: "live", challenger: "9f2K…D4uM", opponent: "Bv7Q…s1Re", pool: 20, winner: null, ago: "now" },
  { id: "DUEL-91C2", stake: 10, status: "open", challenger: "3xKp…Lm0Z", opponent: null, pool: 20, winner: null, ago: "12s ago" },
  { id: "DUEL-22B8", stake: 10, status: "open", challenger: "Az8t…Qh4N", opponent: null, pool: 20, winner: null, ago: "44s ago" },
  { id: "DUEL-08E1", stake: 10, status: "settled", challenger: "Td5w…Rk9P", opponent: "Mq2c…V7bL", pool: 20, winner: "Td5w…Rk9P", ago: "2m ago" },
  { id: "DUEL-5C77", stake: 10, status: "settled", challenger: "Yh1n…Gc3X", opponent: "Wf6r…Up2D", pool: 20, winner: "Wf6r…Up2D", ago: "5m ago" },
]

export const duelTiers = [
  {
    stake: 10,
    name: "$10 Duel",
    tagline: "Fast entry. Quick battle. Winner takes a random vault slab.",
    pool: 20,
    accent: "primary" as const,
    soon: false,
  },
]

export const duelFlow = [
  "Connect Wallet",
  "Select a $10 Duel",
  "Create or Accept Challenge",
  "Randomness Resolves Battle",
  "Slab Reserved / Proof Posted",
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

export const proofRecords: ProofRecord[] = []

// ---- Treasury Vault ----

export const treasuryStats = [
  { label: "Treasury Balance", value: "—", accent: true },
  { label: "Cards Purchased", value: "—" },
  { label: "Cards Available", value: "—" },
  { label: "Next Airdrop", value: "—", accent: true },
  { label: "Total Airdropped", value: "—" },
  { label: "Last Winner", value: "—" },
]

export const treasurySplit = [
  { pct: 100, label: "Duel entries go to the treasury", color: "var(--primary)" },
]

export const cardTiers = [
  { tier: "COMMON", note: "under $25", color: "var(--muted-foreground)" },
  { tier: "RARE", note: "$25–$35", color: "var(--ocean)" },
  { tier: "EPIC", note: "$35–$50", color: "var(--gold)" },
  { tier: "LEGENDARY", note: "$50–$100", color: "var(--primary)" },
  { tier: "MYTHIC", note: "$100+", color: "var(--foreground)" },
]

// ---- Holder Airdrops ----

export const airdropStats = [
  { label: "Next Airdrop", value: "—", accent: true },
  { label: "Eligible Holders", value: "—" },
  { label: "Total Tickets", value: "—" },
  { label: "Current Prize Pool", value: "—", accent: true },
  { label: "Last Winner", value: "—" },
  { label: "Last Card Pulled", value: "—" },
]

export const airdropFlow = [
  "Snapshot holders",
  "Assign tickets by balance",
  "Generate randomness proof",
  "Select winning wallet",
  "Select card from vault",
  "Post proof",
  "Winner notified, card shipped manually",
]

// ---- Dashboard Preview ----

export const dashboardPreview = [
  { label: "Active Duels", value: "—", accent: true },
  { label: "Total Volume", value: "—" },
  { label: "Treasury Balance", value: "—", accent: true },
  { label: "Cards in Vault", value: "—" },
  { label: "Next Holder Airdrop", value: "—" },
  { label: "Treasury Balance", value: "—" },
  { label: "Latest Duel Winner", value: "—" },
  { label: "Latest Airdrop Winner", value: "—" },
]

export const kotpHowSteps = [
  {
    step: "01",
    title: "Duel",
    body: "Players enter $10 duels. One player creates the duel, and another accepts.",
  },
  {
    step: "02",
    title: "Randomness",
    body: "The duel winner is selected through a provably fair mechanism. The proof record is posted to the Proof Terminal.",
  },
  {
    step: "03",
    title: "Treasury",
    body: "Duel entries flow into the treasury. Treasury funds are used to buy real cards and slabs.",
  },
  {
    step: "04",
    title: "Holder Drops",
    body: "Every hour, a supply-weighted holder airdrop selects a wallet and a random card from the vault.",
  },
  {
    step: "05",
    title: "Proof Posted",
    body: "Every duel, winner, card selection, and airdrop is logged with hashes, transactions, and verification data.",
  },
]


