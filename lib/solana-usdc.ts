import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token"
import { DRY_RUN, SOLANA_RPC_URL, TREASURY_WALLET, USDC_DECIMALS, USDC_MINT, type DuelStake } from "@/lib/duel-store"

type PhantomProvider = {
  publicKey?: { toString(): string }
  signTransaction?(transaction: Transaction): Promise<Transaction>
  signAndSendTransaction?(transaction: Transaction): Promise<{ signature: string }>
}

export type DuelPaymentResult = {
  signature: string
  dryRun: boolean
  logs: string[]
}

function getPhantom(): PhantomProvider {
  const provider = (window as Window & { solana?: PhantomProvider }).solana

  if (!provider?.publicKey) {
    throw new Error("Connect Phantom before creating a duel.")
  }

  if (DRY_RUN && !provider.signTransaction) {
    throw new Error("Phantom signTransaction is unavailable.")
  }

  if (!DRY_RUN && !provider.signAndSendTransaction) {
    throw new Error("Phantom signAndSendTransaction is unavailable.")
  }

  return provider
}

export async function payDuelEntryUsdc(stake: DuelStake): Promise<DuelPaymentResult> {
  const provider = getPhantom()
  const connection = new Connection(SOLANA_RPC_URL, "confirmed")
  const payer = new PublicKey(provider.publicKey!.toString())
  const mint = new PublicKey(USDC_MINT)
  const treasury = new PublicKey(TREASURY_WALLET)
  const sourceAta = getAssociatedTokenAddressSync(mint, payer)
  const treasuryAta = getAssociatedTokenAddressSync(mint, treasury)
  const amount = BigInt(stake) * 10n ** BigInt(USDC_DECIMALS)
  const transaction = new Transaction()

  const treasuryAccount = await connection.getAccountInfo(treasuryAta)
  if (!treasuryAccount) {
    transaction.add(createAssociatedTokenAccountInstruction(payer, treasuryAta, treasury, mint))
  }

  transaction.add(createTransferCheckedInstruction(sourceAta, mint, treasuryAta, payer, amount, USDC_DECIMALS))

  const { blockhash } = await connection.getLatestBlockhash("confirmed")
  transaction.feePayer = payer
  transaction.recentBlockhash = blockhash

  if (DRY_RUN) {
    const signedTransaction = await provider.signTransaction!(transaction)
    const simulation = await connection.simulateTransaction(signedTransaction)
    const logs = simulation.value.logs ?? []

    console.info("DRY_RUN=true: simulated USDC duel payment", {
      stake,
      treasury: TREASURY_WALLET,
      mint: USDC_MINT,
      logs,
    })

    if (simulation.value.err) {
      throw new Error(`USDC payment simulation failed: ${JSON.stringify(simulation.value.err)}`)
    }

    return {
      signature: `dry-run-${blockhash.slice(0, 12)}`,
      dryRun: true,
      logs,
    }
  }

  const sent = await provider.signAndSendTransaction!(transaction)
  return {
    signature: sent.signature,
    dryRun: false,
    logs: [],
  }
}
