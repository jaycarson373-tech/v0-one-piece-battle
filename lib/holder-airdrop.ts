import { Connection } from "@solana/web3.js"
import type { Randomness } from "@switchboard-xyz/on-demand"
import {
  AIRDROP_INTERVAL_MS,
  AIRDROP_STATE_KEY,
  DRY_RUN,
  DUEL_RESULTS_KEY,
  SOLANA_RPC_URL,
  SWITCHBOARD_ON_DEMAND_PACKAGE,
  type AirdropResult,
  type ProofRecord,
  createEventId,
  readJsonArray,
  sha256Hex,
  writeJsonArray,
} from "@/lib/duel-store"

type SwitchboardRandomnessAccount = Randomness

type MockHolder = {
  wallet: string
  tokens: number
}

type MockVaultCard = {
  name: string
  tier: string
}

export type AirdropState = {
  lastWinnerWallet: string
  lastCardPulled: string
  nextAirdropAt: string
  lastEventId: string
}

const mockHolders: MockHolder[] = [
  { wallet: "9f2KD4uM111111111111111111111111111111111", tokens: 350_000 },
  { wallet: "Bv7Qs1Re222222222222222222222222222222222", tokens: 900_000 },
  { wallet: "3xKpLm0Z333333333333333333333333333333333", tokens: 120_000 },
  { wallet: "Mq2cV7bL444444444444444444444444444444444", tokens: 1_500_000 },
]

const mockVaultCards: MockVaultCard[] = [
  { name: "Luffy Leader Alt Art", tier: "LEGENDARY" },
  { name: "Zoro Manga Parallel", tier: "MYTHIC" },
  { name: "Nami Parallel Rare", tier: "RARE" },
  { name: "Sanji Wanted Poster", tier: "COMMON" },
]

export function readAirdropState(): AirdropState {
  if (typeof window === "undefined") {
    return makeEmptyAirdropState()
  }

  try {
    const value = window.localStorage.getItem(AIRDROP_STATE_KEY)
    return value ? (JSON.parse(value) as AirdropState) : makeEmptyAirdropState()
  } catch {
    return makeEmptyAirdropState()
  }
}

export function writeAirdropState(state: AirdropState) {
  window.localStorage.setItem(AIRDROP_STATE_KEY, JSON.stringify(state))
}

export async function runHolderAirdropNow(): Promise<AirdropResult> {
  if (!DRY_RUN) {
    throw new Error("Live holder airdrops are not enabled yet.")
  }

  const snapshot = mockHolders
    .map((holder) => ({
      ...holder,
      tickets: Math.floor(holder.tokens / 100_000),
    }))
    .filter((holder) => holder.tickets > 0)
  const totalTickets = snapshot.reduce((sum, holder) => sum + holder.tickets, 0)

  if (totalTickets <= 0) {
    throw new Error("No eligible holder tickets in snapshot.")
  }

  const timestamp = new Date().toISOString()
  const eventId = createEventId().replace("duel", "airdrop")
  const connection = new Connection(SOLANA_RPC_URL, "confirmed")
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
  const randomnessAccount: SwitchboardRandomnessAccount | null = null
  void randomnessAccount

  const seed = [
    SWITCHBOARD_ON_DEMAND_PACKAGE,
    "devnet-holder-airdrop",
    eventId,
    timestamp,
    blockhash,
    lastValidBlockHeight,
    JSON.stringify(snapshot),
    JSON.stringify(mockVaultCards),
  ].join(":")
  const vrfProof = await sha256Hex(`switchboard-airdrop-vrf:${seed}`)
  const holderRoll = Number.parseInt(vrfProof.slice(0, 12), 16) % totalTickets
  const cardRoll = Number.parseInt(vrfProof.slice(12, 20), 16) % mockVaultCards.length
  const winner = pickWeightedWinner(snapshot, holderRoll)
  const card = mockVaultCards[cardRoll]
  const resultHash = await sha256Hex(
    `${eventId}:${winner.wallet}:${card.name}:${card.tier}:${timestamp}:${vrfProof}:${totalTickets}`,
  )
  const settlementTx = `dry-run-airdrop-${resultHash.slice(0, 16)}`
  const result: AirdropResult = {
    type: "airdrop",
    eventId,
    commitHash: await sha256Hex(`${eventId}:${timestamp}:${blockhash}`),
    resultHash,
    vrfProof,
    settlementTx,
    winnerWallet: winner.wallet,
    timestamp,
    cardName: card.name,
    cardTier: card.tier,
    holderTickets: winner.tickets,
    totalTickets,
    status: "resolved",
  }

  const nextProofRecords = [result, ...readJsonArray<ProofRecord>(DUEL_RESULTS_KEY)].slice(0, 50)
  writeJsonArray(DUEL_RESULTS_KEY, nextProofRecords)
  writeAirdropState({
    lastWinnerWallet: result.winnerWallet,
    lastCardPulled: result.cardName,
    nextAirdropAt: new Date(Date.now() + AIRDROP_INTERVAL_MS).toISOString(),
    lastEventId: result.eventId,
  })

  console.info("DRY_RUN=true: holder airdrop resolved with Switchboard VRF dry-run proof", result)

  return result
}

function pickWeightedWinner<T extends { tickets: number }>(holders: T[], roll: number): T {
  let cursor = roll

  for (const holder of holders) {
    if (cursor < holder.tickets) return holder
    cursor -= holder.tickets
  }

  return holders[holders.length - 1]
}

function makeEmptyAirdropState(): AirdropState {
  return {
    lastWinnerWallet: "",
    lastCardPulled: "",
    nextAirdropAt: new Date(Date.now() + AIRDROP_INTERVAL_MS).toISOString(),
    lastEventId: "",
  }
}
