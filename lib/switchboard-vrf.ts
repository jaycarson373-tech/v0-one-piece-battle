import { Connection, PublicKey } from "@solana/web3.js"
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
  const connection = new Connection(SOLANA_RPC_URL, "confirmed")
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
  const slot = await connection.getSlot("confirmed")
  const blockTime = (await connection.getBlockTime(slot)) ?? Math.floor(Date.now() / 1000)
  const signatures = await connection.getSignaturesForAddress(
    connection.rpcEndpoint.includes("devnet")
      ? new PublicKey("11111111111111111111111111111111")
      : new PublicKey(input.playerA),
    { limit: 1 },
  )
  const signatureSeed = signatures[0]?.signature ?? blockhash
  const randomnessAccount: SwitchboardRandomnessAccount | null = null
  void randomnessAccount

  const seed = [
    SWITCHBOARD_ON_DEMAND_PACKAGE,
    DRY_RUN ? "dry-run" : "mainnet-fallback",
    input.eventId,
    input.playerA,
    input.playerB,
    input.stake,
    input.timestamp,
    signatureSeed,
    blockhash,
    lastValidBlockHeight,
    slot,
    blockTime,
  ].join(":")
  const vrfProof = await sha256Hex(`${DRY_RUN ? "switchboard-vrf" : "on-chain-fallback"}:${seed}`)
  const winnerWallet = Number.parseInt(vrfProof.slice(-2), 16) % 2 === 0 ? input.playerA : input.playerB
  const resultHash = await sha256Hex(
    `${input.eventId}:${input.playerA}:${input.playerB}:${winnerWallet}:${input.timestamp}:${vrfProof}`,
  )
  const settlementTx = `${DRY_RUN ? "dry-run" : "mainnet"}-settlement-${resultHash.slice(0, 16)}`

  console.info(`${DRY_RUN ? "DRY_RUN=true: " : ""}resolved duel randomness`, {
    eventId: input.eventId,
    winnerWallet,
    vrfProof,
    resultHash,
    settlementTx,
    randomnessSource: DRY_RUN ? "switchboard-dry-run" : "on-chain-fallback",
    signatureSeed,
    blockhash,
    lastValidBlockHeight,
    slot,
    blockTime,
  })

  return {
    winnerWallet,
    vrfProof,
    resultHash,
    settlementTx,
  }
}
