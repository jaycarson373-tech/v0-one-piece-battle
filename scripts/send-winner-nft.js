const fs = require("node:fs")
const path = require("node:path")
const { createClient } = require("@supabase/supabase-js")
const {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js")

const bs58Module = require("bs58")
const bs58 = bs58Module.default ?? bs58Module

const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d")

loadEnv()

main().catch((error) => {
  console.error("NFT send failed:", error)
  process.exitCode = 1
})

async function main() {
  const supabase = createSupabaseClient()
  const treasury = readTreasuryKeypair()
  const rpcUrl = requiredEnv("NEXT_PUBLIC_SOLANA_RPC_URL")
  const connection = new Connection(rpcUrl, "confirmed")

  console.log("Looking for latest resolved duel with a reserved winner slab...")
  const { duel, card } = await findLatestReservedWinnerSlab(supabase)

  console.log("Found winner slab:", {
    duelId: duel.id,
    winnerWallet: duel.winner_wallet,
    slabId: card.id,
    nftMintAddress: card.nft_mint_address,
    cardName: card.name,
    cardStatus: card.status,
  })

  const expectedTreasury = process.env.NEXT_PUBLIC_TREASURY_WALLET
  if (expectedTreasury && treasury.publicKey.toBase58() !== expectedTreasury) {
    throw new Error(
      `Treasury private key public key ${treasury.publicKey.toBase58()} does not match NEXT_PUBLIC_TREASURY_WALLET ${expectedTreasury}.`,
    )
  }

  console.log("Sending MPL Core asset transfer...")
  const signature = await sendMplCoreTransfer({
    connection,
    treasury,
    assetAddress: card.nft_mint_address,
    winnerWallet: duel.winner_wallet,
  })

  console.log("MPL Core transfer confirmed:", { signature })

  const { error: updateError } = await supabase
    .from("vault_cards")
    .update({
      status: "airdropped",
      assigned_to: duel.winner_wallet,
      assigned_at: new Date().toISOString(),
    })
    .eq("id", card.id)

  if (updateError) throw updateError

  console.log("Supabase updated:", {
    slabId: card.id,
    status: "airdropped",
    winnerWallet: duel.winner_wallet,
    signature,
  })
}

async function findLatestReservedWinnerSlab(supabase) {
  const { data: duels, error: duelsError } = await supabase
    .from("duels")
    .select("id,winner_wallet,created_at")
    .eq("status", "resolved")
    .not("winner_wallet", "is", null)
    .order("created_at", { ascending: false })
    .limit(10)

  if (duelsError) throw duelsError
  if (!duels?.length) throw new Error("No resolved duels with winner_wallet found.")

  for (const duel of duels) {
    const card = await findReservedCardForDuel(supabase, duel)
    if (card) return { duel, card }
  }

  throw new Error("No reserved vault_cards row found for the latest resolved duel winners.")
}

async function findReservedCardForDuel(supabase, duel) {
  const { data: proof } = await supabase
    .from("proof_log")
    .select("slab_id")
    .eq("event_id", duel.id)
    .eq("event_type", "duel_slab_assignment")
    .not("slab_id", "is", null)
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (proof?.slab_id) {
    const { data: proofCard, error: proofCardError } = await supabase
      .from("vault_cards")
      .select("id,name,status,assigned_to,assigned_at,nft_mint_address")
      .eq("id", proof.slab_id)
      .eq("status", "reserved")
      .eq("assigned_to", duel.winner_wallet)
      .maybeSingle()

    if (proofCardError) throw proofCardError
    if (proofCard?.nft_mint_address) return proofCard
  }

  const { data: fallbackCard, error: fallbackError } = await supabase
    .from("vault_cards")
    .select("id,name,status,assigned_to,assigned_at,nft_mint_address")
    .eq("status", "reserved")
    .eq("assigned_to", duel.winner_wallet)
    .not("nft_mint_address", "is", null)
    .order("assigned_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fallbackError) throw fallbackError
  return fallbackCard
}

async function sendMplCoreTransfer({ connection, treasury, assetAddress, winnerWallet }) {
  const asset = new PublicKey(assetAddress)
  const winner = new PublicKey(winnerWallet)
  const instruction = createMplCoreTransferInstruction({
    asset,
    payer: treasury.publicKey,
    authority: treasury.publicKey,
    newOwner: winner,
  })
  const transaction = new Transaction().add(instruction)

  return sendAndConfirmTransaction(connection, transaction, [treasury], {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  })
}

function createMplCoreTransferInstruction({ asset, payer, authority, newOwner }) {
  return new TransactionInstruction({
    programId: MPL_CORE_PROGRAM_ID,
    keys: [
      { pubkey: asset, isSigner: false, isWritable: true },
      { pubkey: MPL_CORE_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false },
      { pubkey: newOwner, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: MPL_CORE_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from([14, 0]),
  })
}

function createSupabaseClient() {
  return createClient(requiredEnv("NEXT_PUBLIC_SUPABASE_URL"), requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: {
      persistSession: false,
    },
  })
}

function readTreasuryKeypair() {
  const rawKey = requiredEnv("TREASURY_WALLET_PRIVATE_KEY")
  let secretKey

  try {
    secretKey = Uint8Array.from(JSON.parse(rawKey))
  } catch {
    secretKey = bs58.decode(rawKey)
  }

  return Keypair.fromSecretKey(secretKey)
}

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is missing.`)
  return value
}

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) process.env[key] = value
  }
}
