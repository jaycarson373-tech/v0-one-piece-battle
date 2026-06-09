import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js"
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token"

type SendSlabRequest = {
  eventId: string
  slabId: string
  winnerWallet: string
  nftMintAddress: string | null
}

export async function POST(request: Request) {
  const input = (await request.json()) as SendSlabRequest
  const dryRun = process.env.DRY_RUN !== "false"
  console.log("/api/send-slab request received", {
    eventId: input.eventId,
    slabId: input.slabId,
    winnerWallet: input.winnerWallet,
    nftMintAddress: input.nftMintAddress,
    dryRun,
  })

  const supabase = getServerSupabaseClient()
  const { data: card, error: cardError } = await supabase
    .from("vault_cards")
    .select("id,nft_mint_address")
    .eq("id", input.slabId)
    .single()

  if (cardError || !card) {
    console.error("Treasury NFT slab lookup failed", { slabId: input.slabId, error: cardError })
    return NextResponse.json({ error: "Vault card was not found for NFT transfer." }, { status: 404 })
  }

  const nftMintAddress = card.nft_mint_address ?? input.nftMintAddress

  if (dryRun) {
    console.info("DRY_RUN=true: simulated treasury NFT slab transfer", { ...input, nftMintAddress })
    console.log("/api/send-slab completed", {
      eventId: input.eventId,
      slabId: input.slabId,
      winnerWallet: input.winnerWallet,
      status: "reserved",
      dryRun: true,
    })
    return NextResponse.json({
      dryRun: true,
      signature: `dry-run-nft-${input.slabId}`,
      status: "reserved",
    })
  }

  if (!nftMintAddress) {
    return NextResponse.json({ error: "Vault card is missing nft_mint_address." }, { status: 400 })
  }

  try {
    const treasury = readTreasuryKeypair()
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed")
    const mint = new PublicKey(nftMintAddress)
    const winner = new PublicKey(input.winnerWallet)
    const sourceAta = getAssociatedTokenAddressSync(mint, treasury.publicKey)
    const destinationAta = getAssociatedTokenAddressSync(mint, winner)
    const transaction = new Transaction()

    const destinationAccount = await connection.getAccountInfo(destinationAta)
    if (!destinationAccount) {
      transaction.add(createAssociatedTokenAccountInstruction(treasury.publicKey, destinationAta, winner, mint))
    }

    transaction.add(createTransferCheckedInstruction(sourceAta, mint, destinationAta, treasury.publicKey, 1n, 0))

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
    transaction.feePayer = treasury.publicKey
    transaction.recentBlockhash = blockhash
    transaction.sign(treasury)

    const signature = await connection.sendRawTransaction(transaction.serialize())
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed")

    console.info("Treasury NFT slab transfer confirmed", {
      eventId: input.eventId,
      slabId: input.slabId,
      winnerWallet: input.winnerWallet,
      nftMintAddress,
      signature,
    })

    const { error: updateError } = await supabase
      .from("vault_cards")
      .update({
        status: "airdropped",
        assigned_to: input.winnerWallet,
        assigned_at: new Date().toISOString(),
      })
      .eq("id", input.slabId)

    if (updateError) {
      console.error("NFT sent but failed to mark slab airdropped in Supabase", {
        slabId: input.slabId,
        winnerWallet: input.winnerWallet,
        signature,
        error: updateError,
      })
      return NextResponse.json({
        dryRun: false,
        signature,
        sent: true,
        status: "sent_update_failed",
        error: updateError.message,
      })
    }

    console.log("/api/send-slab completed", {
      eventId: input.eventId,
      slabId: input.slabId,
      winnerWallet: input.winnerWallet,
      status: "airdropped",
      dryRun: false,
      signature,
    })

    return NextResponse.json({ dryRun: false, signature, sent: true, status: "airdropped" })
  } catch (error) {
    console.error("Treasury NFT slab transfer failed", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Treasury NFT slab transfer failed." },
      { status: 500 },
    )
  }
}

function readTreasuryKeypair() {
  const raw = process.env.TREASURY_WALLET_PRIVATE_KEY
  if (!raw) throw new Error("TREASURY_WALLET_PRIVATE_KEY is missing.")

  const secret = JSON.parse(raw) as number[]
  return Keypair.fromSecretKey(Uint8Array.from(secret))
}

function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env vars are missing for slab transfer.")
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}
