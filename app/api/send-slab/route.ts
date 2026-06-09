import { NextResponse } from "next/server"
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

  if (dryRun) {
    console.info("DRY_RUN=true: simulated treasury NFT slab transfer", input)
    return NextResponse.json({
      dryRun: true,
      signature: `dry-run-nft-${input.slabId}`,
    })
  }

  if (!input.nftMintAddress) {
    return NextResponse.json({ error: "Vault card is missing nft_mint_address." }, { status: 400 })
  }

  try {
    const treasury = readTreasuryKeypair()
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed")
    const mint = new PublicKey(input.nftMintAddress)
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
      nftMintAddress: input.nftMintAddress,
      signature,
    })

    return NextResponse.json({ dryRun: false, signature })
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
