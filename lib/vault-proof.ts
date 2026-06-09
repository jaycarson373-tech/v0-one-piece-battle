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

  const orderedCards = await orderCardsByVrf(availableCards, input)

  for (const selectedCard of orderedCards) {
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
    if (!reservedCard) continue

    try {
      await sendSlabToWinner({
        slabId: reservedCard.id,
        winnerWallet: input.winnerWallet,
        eventId: input.eventId,
        nftMintAddress: reservedCard.nft_mint_address,
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
    } catch (error) {
      console.error("Treasury NFT send failed; releasing slab and trying next available card", {
        eventId: input.eventId,
        slabId: reservedCard.id,
        error,
      })

      const { error: releaseError } = await supabase
        .from("vault_cards")
        .update({
          status: "available",
          assigned_to: null,
          assigned_at: null,
        })
        .eq("id", reservedCard.id)

      if (releaseError) throw releaseError
    }
  }

  throw new Error("No available slab could be sent to the winner.")
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

export async function settleDuelTreasuryReceipt(input: {
  eventId: string
  playerA: string
  playerB: string
}) {
  if (DRY_RUN) {
    console.info("DRY_RUN=true: simulated full duel entry receipt to treasury", {
      eventId: input.eventId,
      playerA: input.playerA,
      playerB: input.playerB,
      playerAUsdc: 10,
      playerBUsdc: 10,
      treasuryUsdc: 20,
      treasuryWallet: process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "",
    })
    return {
      receiptSignature: "dry-run-full-duel-treasury-receipt",
    }
  }

  console.info("Live duel treasury receipt already funded by confirmed player USDC transfers", {
    eventId: input.eventId,
    playerA: input.playerA,
    playerB: input.playerB,
    playerAUsdc: 10,
    playerBUsdc: 10,
    treasuryUsdc: 20,
    treasuryWallet: process.env.NEXT_PUBLIC_TREASURY_WALLET ?? "",
  })

  return {
    receiptSignature: "confirmed-player-usdc-transfers",
  }
}

async function orderCardsByVrf(cards: VaultCardRow[], input: AssignSlabInput) {
  const rollSeed = await sha256Hex(`${input.eventId}:${input.winnerWallet}:${input.vrfProof}:vault-card`)
  const startIndex = Number.parseInt(rollSeed.slice(0, 12), 16) % cards.length
  return [...cards.slice(startIndex), ...cards.slice(0, startIndex)]
}

async function sendSlabToWinner(input: {
  slabId: string
  winnerWallet: string
  eventId: string
  nftMintAddress: string | null
}) {
  const response = await fetch("/api/send-slab", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error ?? "Treasury NFT slab transfer failed.")
  }

  return response.json()
}
