import { Connection } from "@solana/web3.js"
import type { Randomness } from "@switchboard-xyz/on-demand"
import {
  DRY_RUN,
  SOLANA_RPC_URL,
  SWITCHBOARD_ON_DEMAND_PACKAGE,
  type DuelStake,
  sha256Hex,
} from "@/lib/duel-store"

type SwitchboardRandomnessAccount = Randomness

export type DuelResolution = {
  winnerWallet: string
  vrfProof: string
  resultHash: string
  settlementTx: string
}

export async function resolveDuelWithSwitchboardVrf(input: {
  eventId: string
  playerA: string
  playerB: string
  stake: DuelStake
  timestamp: string
}): Promise<DuelResolution> {
  if (!DRY_RUN) {
    throw new Error("Live Switchboard VRF resolution is not enabled yet.")
  }

  const connection = new Connection(SOLANA_RPC_URL, "confirmed")
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
  const randomnessAccount: SwitchboardRandomnessAccount | null = null
  void randomnessAccount

  const seed = [
    SWITCHBOARD_ON_DEMAND_PACKAGE,
    "devnet",
    input.eventId,
    input.playerA,
    input.playerB,
    input.stake,
    input.timestamp,
    blockhash,
    lastValidBlockHeight,
  ].join(":")
  const vrfProof = await sha256Hex(`switchboard-vrf:${seed}`)
  const winnerWallet = Number.parseInt(vrfProof.slice(-2), 16) % 2 === 0 ? input.playerA : input.playerB
  const resultHash = await sha256Hex(
    `${input.eventId}:${input.playerA}:${input.playerB}:${winnerWallet}:${input.timestamp}:${vrfProof}`,
  )
  const settlementTx = `dry-run-settlement-${resultHash.slice(0, 16)}`

  console.info("DRY_RUN=true: resolved duel with Switchboard VRF dry-run proof", {
    eventId: input.eventId,
    winnerWallet,
    vrfProof,
    resultHash,
    settlementTx,
    blockhash,
    lastValidBlockHeight,
  })

  return {
    winnerWallet,
    vrfProof,
    resultHash,
    settlementTx,
  }
}
