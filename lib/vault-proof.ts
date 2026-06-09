import { DRY_RUN, sha256Hex } from "@/lib/duel-store"
import { getSupabaseDuelsClient, type ProofLogRow, type VaultCardRow } from "@/lib/supabase-duels"

export type SlabAssignmentResult = {
  proof: ProofLogRow
  slab: VaultCardRow | null
}

type AssignSlabInput = {
  eventId: string
  eventType: "duel_slab_assignment" | "holder_airdrop"
  winnerWallet: string
  vrfProof: string
  resultHash: string
}

export async function assignAvailableSlab(input: AssignSlabInput): Promise<SlabAssignmentResult> {
  const supabase = getSupabaseDuelsClient()
  if (!supabase) {
    throw new Error("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const { data: availableCards, error: cardsError } = await supabase
    .from("vault_cards")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: true })

  if (cardsError) throw cardsError

  if (!availableCards || availableCards.length === 0) {
    const proof = await postProofRecord({
      event_id: input.eventId,
      event_type: "no_slab_available",
      winner_wallet: input.winnerWallet,
      slab_id: null,
      vrf_proof: input.vrfProof,
      result_hash: input.resultHash,
      status: "settled",
    })

    console.info("DRY_RUN=true: no available slab for winner", {
      eventId: input.eventId,
      winnerWallet: input.winnerWallet,
    })

    return { proof, slab: null }
  }

  const rollSeed = await sha256Hex(`${input.eventId}:${input.winnerWallet}:${input.vrfProof}:vault-card`)
  const selectedCard = availableCards[Number.parseInt(rollSeed.slice(0, 12), 16) % availableCards.length]
  const assignedAt = new Date().toISOString()
  const { data: reservedCard, error: reserveError } = await supabase
    .from("vault_cards")
    .update({
      status: "reserved",
      assigned_to: input.winnerWallet,
      assigned_at: assignedAt,
    })
    .eq("id", selectedCard.id)
    .eq("status", "available")
    .select()
    .maybeSingle()

  if (reserveError) throw reserveError
  if (!reservedCard) throw new Error("Selected slab was already reserved. Try resolving again.")

  await sendSlabToWinner({
    slabId: reservedCard.id,
    winnerWallet: input.winnerWallet,
    eventId: input.eventId,
  })

  const proof = await postProofRecord({
    event_id: input.eventId,
    event_type: input.eventType,
    winner_wallet: input.winnerWallet,
    slab_id: reservedCard.id,
    vrf_proof: input.vrfProof,
    result_hash: input.resultHash,
    status: "settled",
  })

  return { proof, slab: reservedCard }
}

export async function postProofRecord(input: Omit<ProofLogRow, "timestamp">): Promise<ProofLogRow> {
  const supabase = getSupabaseDuelsClient()
  if (!supabase) {
    throw new Error("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const { data, error } = await supabase.from("proof_log").upsert(input).select().single()
  if (error) throw error
  return data
}

export async function settleDuelUsdcPayout(input: {
  eventId: string
  winnerWallet: string
  loserWallet: string
}) {
  if (DRY_RUN) {
    console.info("DRY_RUN=true: simulated duel payout", {
      eventId: input.eventId,
      winnerWallet: input.winnerWallet,
      loserWallet: input.loserWallet,
      winnerUsdc: 18,
      treasuryFeeUsdc: 2,
      duelWallet: process.env.NEXT_PUBLIC_DUEL_WALLET ?? "",
      treasuryWallet: process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "",
    })
    return {
      winnerSignature: "dry-run-winner-usdc",
      treasurySignature: "dry-run-treasury-fee",
    }
  }

  throw new Error("Live duel payout transfers are not enabled yet.")
}

async function sendSlabToWinner(input: { slabId: string; winnerWallet: string; eventId: string }) {
  if (DRY_RUN) {
    console.info("DRY_RUN=true: simulated treasury slab transfer", {
      eventId: input.eventId,
      slabId: input.slabId,
      winnerWallet: input.winnerWallet,
      treasuryWallet: process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "",
    })
    return
  }

  throw new Error("Live slab NFT transfers are not enabled yet.")
}
