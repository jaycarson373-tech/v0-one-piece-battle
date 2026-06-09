export const DRY_RUN = process.env.NEXT_PUBLIC_DRY_RUN !== "false" && process.env.DRY_RUN !== "false"
export const TREASURY_WALLET =
  process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "AuPgBoGhnqdmBE4LnjGoy4uUwRWmfRQDBVGDrbqQtux8"
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com"
export const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT ?? "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
export const USDC_DECIMALS = 6
export const SWITCHBOARD_ON_DEMAND_PACKAGE = "@switchboard-xyz/on-demand"
export const OPEN_DUELS_KEY = "kotp.openDuels"
export const DUEL_RESULTS_KEY = "kotp.duelResults"
export const AIRDROP_STATE_KEY = "kotp.airdropState"
export const CONNECTED_WALLET_KEY = "kotp.connectedWallet"
export const WALLET_EVENT = "kotp-wallet-change"
export const DUEL_EVENT = "kotp-duel-change"
export const AIRDROP_INTERVAL_MS = 60 * 60 * 1000

export type DuelStake = 10

export type OpenDuel = {
  id: string
  eventId: string
  stake: DuelStake
  playerA: string
  createdAt: string
  dryRun: true
  token: "USDC"
  mint: string
  treasuryWallet: string
  paymentSignature: string
}

export type DuelResult = {
  type: "duel"
  eventId: string
  commitHash: string
  resultHash: string
  vrfProof: string
  settlementTx: string
  playerA: string
  playerB: string
  winner: string
  winnerWallet: string
  timestamp: string
  stake: DuelStake
  status: "resolved"
}

export type AirdropResult = {
  type: "airdrop"
  eventId: string
  commitHash: string
  resultHash: string
  vrfProof: string
  settlementTx: string
  winnerWallet: string
  timestamp: string
  cardName: string
  cardTier: string
  holderTickets: number
  totalTickets: number
  status: "resolved"
}

export type ProofRecord = DuelResult | AirdropResult

export function shortWallet(wallet: string) {
  if (wallet.length <= 10) return wallet
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
}

export function readJsonArray<T>(key: string): T[] {
  if (typeof window === "undefined") return []

  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T[]) : []
  } catch {
    return []
  }
}

export function writeJsonArray<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(DUEL_EVENT))
}

export function createEventId() {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `duel-${id.slice(0, 8)}`
}

export async function makeCommitHash(input: {
  eventId: string
  playerA: string
  playerB: string
  winner: string
  timestamp: string
}) {
  return sha256Hex(`${input.eventId}:${input.playerA}:${input.playerB}:${input.winner}:${input.timestamp}`)
}

export async function sha256Hex(payload: string) {
  const bytes = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
