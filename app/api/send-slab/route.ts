import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import { transferV1 } from "@metaplex-foundation/mpl-core"
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters"

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
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com"
    const umi = createUmi(rpcUrl)
    const treasurySigner = createSignerFromKeypair(umi, fromWeb3JsKeypair(treasury))
    umi.use(signerIdentity(treasurySigner))
    const collectionAddress = await getAssetCollectionAddress(rpcUrl, nftMintAddress)

    const signature = await transferV1(umi, {
      asset: publicKey(nftMintAddress),
      collection: collectionAddress ? publicKey(collectionAddress) : undefined,
      newOwner: publicKey(input.winnerWallet),
      authority: umi.identity,
    }).sendAndConfirm(umi)

    console.info("Treasury NFT slab transfer confirmed", {
      eventId: input.eventId,
      slabId: input.slabId,
      winnerWallet: input.winnerWallet,
      nftMintAddress,
      collectionAddress,
      signature: bs58.encode(signature.signature),
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
        signature: bs58.encode(signature.signature),
        error: updateError,
      })
      return NextResponse.json({
        dryRun: false,
        signature: bs58.encode(signature.signature),
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
      signature: bs58.encode(signature.signature),
    })

    return NextResponse.json({ dryRun: false, signature: bs58.encode(signature.signature), sent: true, status: "airdropped" })
  } catch (error) {
    console.error("Treasury NFT slab transfer failed", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Treasury NFT slab transfer failed." },
      { status: 500 },
    )
  }
}

function readTreasuryKeypair() {
  const rawKey = process.env.TREASURY_WALLET_PRIVATE_KEY
  if (!rawKey) throw new Error("TREASURY_WALLET_PRIVATE_KEY is missing.")

  let secretKey: Uint8Array
  try {
    secretKey = Uint8Array.from(JSON.parse(rawKey))
  } catch {
    secretKey = bs58.decode(rawKey)
  }

  return Keypair.fromSecretKey(secretKey)
}

async function getAssetCollectionAddress(rpcUrl: string, nftMintAddress: string) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAsset",
      params: { id: nftMintAddress },
    }),
  })

  if (!response.ok) {
    throw new Error(`Helius getAsset failed with status ${response.status}.`)
  }

  const asset = await response.json()
  const collectionAddress = asset.result?.grouping?.find(
    (group: { group_key?: string; group_value?: string }) => group.group_key === "collection",
  )?.group_value

  console.log("MPL Core asset collection lookup", {
    nftMintAddress,
    collectionAddress: collectionAddress ?? null,
  })

  return collectionAddress
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
