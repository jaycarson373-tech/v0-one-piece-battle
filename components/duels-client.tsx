"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Swords } from "lucide-react"
import {
  CONNECTED_WALLET_KEY,
  DUEL_RESULTS_KEY,
  OPEN_DUELS_KEY,
  type DuelResult,
  type DuelStake,
  type OpenDuel,
  createEventId,
  makeCommitHash,
  readJsonArray,
  shortWallet,
  TREASURY_WALLET,
  writeJsonArray,
  USDC_MINT,
  WALLET_EVENT,
} from "@/lib/duel-store"
import { payDuelEntryUsdc } from "@/lib/solana-usdc"
import { resolveDuelWithSwitchboardVrf } from "@/lib/switchboard-vrf"

function useConnectedWallet() {
  const [wallet, setWallet] = useState("")

  useEffect(() => {
    const syncWallet = () => setWallet(window.localStorage.getItem(CONNECTED_WALLET_KEY) ?? "")
    syncWallet()
    window.addEventListener(WALLET_EVENT, syncWallet)
    window.addEventListener("storage", syncWallet)
    return () => {
      window.removeEventListener(WALLET_EVENT, syncWallet)
      window.removeEventListener("storage", syncWallet)
    }
  }, [])

  return wallet
}

export function DuelsClient() {
  const wallet = useConnectedWallet()
  const [openDuels, setOpenDuels] = useState<OpenDuel[]>([])
  const [message, setMessage] = useState("")
  const [pendingStake, setPendingStake] = useState<DuelStake | null>(null)
  const [resolvingDuelId, setResolvingDuelId] = useState("")

  useEffect(() => {
    setOpenDuels(readJsonArray<OpenDuel>(OPEN_DUELS_KEY))
  }, [])

  async function startDuel(stake: DuelStake) {
    if (!wallet) {
      setMessage("Connect Phantom in the nav before starting a duel.")
      return
    }

    setPendingStake(stake)
    setMessage(`DRY_RUN=true: requesting Phantom signature to simulate ${stake} USDC payment.`)

    try {
      const payment = await payDuelEntryUsdc(stake)

      const nextDuel: OpenDuel = {
        id: createEventId(),
        eventId: createEventId(),
        stake,
        playerA: wallet,
        createdAt: new Date().toISOString(),
        dryRun: true,
        token: "USDC",
        mint: USDC_MINT,
        treasuryWallet: TREASURY_WALLET,
        paymentSignature: payment.signature,
      }

      const nextOpenDuels = [nextDuel, ...openDuels]
      setOpenDuels(nextOpenDuels)
      writeJsonArray(OPEN_DUELS_KEY, nextOpenDuels)
      setMessage(`DRY_RUN=true: ${stake} USDC payment simulated. Duel opened. No funds moved.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "USDC payment simulation failed.")
    } finally {
      setPendingStake(null)
    }
  }

  async function acceptDuel(duel: OpenDuel) {
    if (!wallet) {
      setMessage("Connect Phantom in the nav before accepting a duel.")
      return
    }

    if (wallet === duel.playerA) {
      setMessage("Waiting for a different wallet to accept this duel.")
      return
    }

    setResolvingDuelId(duel.id)
    setMessage("DRY_RUN=true: requesting Switchboard VRF dry-run resolution.")

    try {
      const timestamp = new Date().toISOString()
      const resolution = await resolveDuelWithSwitchboardVrf({
        eventId: duel.eventId,
        playerA: duel.playerA,
        playerB: wallet,
        stake: duel.stake,
        timestamp,
      })
      const resultBase = {
        eventId: duel.eventId,
        playerA: duel.playerA,
        playerB: wallet,
        winner: resolution.winnerWallet,
        timestamp,
      }
      const result: DuelResult = {
        ...resultBase,
        commitHash: await makeCommitHash(resultBase),
        resultHash: resolution.resultHash,
        vrfProof: resolution.vrfProof,
        settlementTx: resolution.settlementTx,
        winnerWallet: resolution.winnerWallet,
        stake: duel.stake,
        status: "resolved",
      }

      const nextOpenDuels = openDuels.filter((item) => item.id !== duel.id)
      const nextResults = [result, ...readJsonArray<DuelResult>(DUEL_RESULTS_KEY)].slice(0, 50)
      setOpenDuels(nextOpenDuels)
      writeJsonArray(OPEN_DUELS_KEY, nextOpenDuels)
      writeJsonArray(DUEL_RESULTS_KEY, nextResults)
      setMessage("DRY_RUN=true: duel resolved and proof posted. No funds moved.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Switchboard VRF dry-run resolution failed.")
    } finally {
      setResolvingDuelId("")
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Swords className="h-4 w-4" />
            Duel Core
          </div>
          <h1 className="font-display text-4xl uppercase text-foreground sm:text-5xl">Duels</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            DRY_RUN=true. Duels are priced in USDC on Solana, but no real funds move in this mode.
          </p>
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-muted-foreground">
          {wallet ? shortWallet(wallet) : "Wallet not connected"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[10, 50].map((stake) => (
          <button
            key={stake}
            type="button"
            onClick={() => startDuel(stake as DuelStake)}
            disabled={pendingStake !== null}
            className="rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"
          >
            <span className="font-display text-3xl uppercase text-primary">Start ${stake} Duel</span>
            <span className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              {pendingStake === stake ? "Waiting for Phantom" : `${stake} USDC dry-run payment`}
            </span>
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-secondary p-4 text-sm font-medium text-foreground">
          {message}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-heading text-lg font-extrabold text-foreground">Open duels waiting for an opponent</h2>
        </div>
        <div className="divide-y divide-border">
          {openDuels.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No open duels yet.</div>
          ) : (
            openDuels.map((duel) => (
              <div key={duel.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-2 text-sm">
                  <div className="font-mono text-xs text-muted-foreground">{duel.eventId}</div>
                  <div className="font-heading text-xl font-extrabold text-foreground">{duel.stake} USDC</div>
                  <div className="text-muted-foreground">Player A: {shortWallet(duel.playerA)}</div>
                  <div className="text-xs text-muted-foreground">Created {new Date(duel.createdAt).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => acceptDuel(duel)}
                  disabled={resolvingDuelId === duel.id}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                >
                  {resolvingDuelId === duel.id ? "Resolving" : "Accept Duel"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
