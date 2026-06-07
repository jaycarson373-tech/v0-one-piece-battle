// Battle resolver — the single source of truth for a battle outcome.
//
// ARCHITECTURE
// ------------
// The animation must NEVER pick the winner. It only *performs* a result that
// has already been finalized here. That keeps the show provably fair: the
// randomness happens once, up front, and every phase of the UI (wallet draw →
// clash → winner → prize) is just a replay of this object.
//
//   resolveBattle()  ->  BattleResult  ->  <LiveArena/> animates it
//
// MOCK vs PRODUCTION
// ------------------
// Today `requestBattle()` resolves locally using a public seed + the
// dependency-free PRNG in lib/provably-fair.ts. To go live, Codex swaps the
// body of `requestBattle()` to:
//   1. Snapshot eligible holders on-chain.
//   2. Request verifiable randomness from the VRF provider.
//   3. On the VRF callback, feed `result.value` as the `seed` to the SAME pure
//      functions below, write the result account, and emit an event.
// The returned shape stays identical, so the frontend never changes.
//
// RECOMMENDED PROVIDER: Switchboard On-Demand Randomness.
//   - Pull-based: you request randomness and settle in the same flow, so the
//     UI can show "requesting → settling → settled" without a long poll.
//   - Mainnet-ready, audited, well-documented Anchor integration.
//   - Lighter alternative: ORAO VRF (fewer moving parts, callback-based).
//   Either way the seed handed to the functions below is the only thing that
//   matters — port these functions to Rust and anyone can re-verify on-chain.

import { eligibleHolders, prizePool, type Holder, type PoolCard } from "@/lib/arena"
import { pickIndices, rollBattle, pickWeighted, proofHash } from "@/lib/provably-fair"

export type RandomnessSource = "mock-vrf" | "switchboard" | "orao"

export type BattleResult = {
  battleId: string
  // The public, committed-before-resolution randomness. In production this is
  // the Switchboard randomness value (or Solana slot blockhash) as a string.
  seed: string
  // Short shareable proof anyone can recompute from the seed.
  proof: string
  source: RandomnessSource
  // The two randomly drawn slab-holders (index in eligibleHolders preserved so
  // the case-opening reel can land on the right card).
  fighterAIndex: number
  fighterBIndex: number
  fighterA: Holder
  fighterB: Holder
  // Settled battle scores + the randomly chosen winner.
  scoreA: number
  scoreB: number
  winner: "a" | "b"
  winnerHolder: Holder
  // The graded slab the winner takes, drawn from the treasury pool with the
  // same seed (independently verifiable via the ":prize" salt).
  prize: PoolCard
}

// Generate a fresh public seed. In production this is replaced by the VRF value.
function makeSeed(): string {
  const slot = 296_000_000 + Math.floor(Math.random() * 900_000)
  const hex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return `slot:${slot}:${hex}`
}

// Pure, deterministic resolution from a single public seed. This is the exact
// logic Codex ports to the Solana program — given the same seed + holder list,
// it always produces the same BattleResult, on any platform.
export function resolveFromSeed(seed: string, source: RandomnessSource = "mock-vrf"): BattleResult {
  const [iA, iB] = pickIndices(seed, eligibleHolders.length, 2)
  const fighterA = eligibleHolders[iA]
  const fighterB = eligibleHolders[iB]

  const roll = rollBattle(seed, fighterA.character.power, fighterB.character.power)
  const prizeIdx = pickWeighted(
    seed,
    prizePool.map((c) => c.weight),
  )

  return {
    battleId: proofHash(seed).slice(0, 10),
    seed,
    proof: proofHash(seed),
    source,
    fighterAIndex: iA,
    fighterBIndex: iB,
    fighterA,
    fighterB,
    scoreA: roll.aScore,
    scoreB: roll.bScore,
    winner: roll.winner,
    winnerHolder: roll.winner === "a" ? fighterA : fighterB,
    prize: prizePool[prizeIdx],
  }
}

// The swap point. Mock = resolve locally and instantly.
// Production = request VRF, await the callback, then `resolveFromSeed(vrfValue)`.
// Async by design so the real implementation drops in without touching callers.
export async function requestBattle(): Promise<BattleResult> {
  // --- MOCK (today) ---
  return resolveFromSeed(makeSeed(), "mock-vrf")

  // --- PRODUCTION (Codex swaps to this) ---
  // const seed = await switchboard.requestAndAwaitRandomness(snapshotSlot)
  // const result = resolveFromSeed(seed, "switchboard")
  // await program.methods.settleBattle(result).rpc()  // write result account + emit event
  // return result
}
