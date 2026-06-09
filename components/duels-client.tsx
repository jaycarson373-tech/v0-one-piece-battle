"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Swords } from "lucide-react"
import {
  CONNECTED_WALLET_KEY,
  type DuelStake,
  type OpenDuel,
  createEventId,
  shortWallet,
  TREASURY_WALLET,
  USDC_MINT,
  WALLET_EVENT,
} from "@/lib/duel-store"
import {
  DUELS_REALTIME_CHANNEL,
  DUELS_REALTIME_FILTER,
  PROOF_LOG_REALTIME_CHANNEL,
  PROOF_LOG_REALTIME_FILTER,
  VAULT_CARDS_REALTIME_CHANNEL,
  VAULT_CARDS_REALTIME_FILTER,
  getSupabaseDuelsClient,
  type ProofLogRow,
  type SupabaseDuelRow,
  type VaultCardRow,
} from "@/lib/supabase-duels"
import { subscribeWithBackoff } from "@/lib/supabase-realtime"
import { resolveDuelWithSwitchboardVrf } from "@/lib/switchboard-vrf"
import { payDuelEntryUsdc } from "@/lib/solana-usdc"
import { assignAvailableSlab, sendSlabToWinner, settleDuelTreasuryReceipt } from "@/lib/vault-proof"

type DuelListItem = OpenDuel & {
  status: "open" | "resolving" | "settled"
  playerB?: string
  winnerWallet?: string
}

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

function mapSupabaseDuel(row: SupabaseDuelRow): DuelListItem {
  return {
    id: row.id,
    eventId: row.id,
    stake: 10,
    playerA: row.creator_wallet,
    playerB: row.acceptor_wallet ?? undefined,
    createdAt: row.created_at,
    dryRun: true,
    token: "USDC",
    mint: USDC_MINT,
    treasuryWallet: TREASURY_WALLET,
    paymentSignature: "dry-run-supabase",
    status: row.status === "resolved" ? "settled" : row.status,
    winnerWallet: row.winner_wallet ?? undefined,
  }
}

function sortDuels(items: DuelListItem[]) {
  return [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function DuelsClient() {
  const wallet = useConnectedWallet()
  const [duels, setDuels] = useState<DuelListItem[]>([])
  const [proofLog, setProofLog] = useState<ProofLogRow[]>([])
  const [vaultCards, setVaultCards] = useState<VaultCardRow[]>([])
  const [message, setMessage] = useState("")
  const [claimMessage, setClaimMessage] = useState("")
  const [claimDuelId, setClaimDuelId] = useState("")
  const [resolvingDuelId, setResolvingDuelId] = useState("")
  const activeDuels = duels.filter((duel) => duel.status !== "settled")
  const settledDuels = duels.filter((duel) => duel.status === "settled")

  useEffect(() => {
    if (!wallet) return

    const latestSettledDuel = duels.find(
      (duel) => duel.winnerWallet && (duel.playerA === wallet || duel.playerB === wallet),
    )

    if (!latestSettledDuel?.winnerWallet) return

    if (latestSettledDuel.winnerWallet !== wallet) {
      setClaimDuelId("")
      setClaimMessage("")
      setMessage("YOU LOST. Better luck next time pirate.")
      return
    }

    const slab = getAssignedSlabCard(latestSettledDuel, proofLog, vaultCards)
    setClaimDuelId(slab ? latestSettledDuel.id : "")
    setMessage(slab ? formatWinnerMessage(slab) : "🏴‍☠️ YOU WON! Slab assignment is pending.")
  }, [wallet, duels, proofLog, vaultCards])

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()

    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    async function loadDuels() {
      const { data, error } = await supabase
        .from("duels")
        .select("*")
        .in("status", ["open", "resolving", "resolved"])
        .order("created_at", { ascending: false })

      if (error) {
        setMessage(error.message)
        return
      }

      setDuels((data ?? []).map(mapSupabaseDuel))
    }

    return subscribeWithBackoff({
      supabase,
      label: "duels",
      onSubscribed: () => void loadDuels(),
      createChannel: () =>
        supabase.channel(DUELS_REALTIME_CHANNEL).on("postgres_changes", DUELS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<SupabaseDuelRow>
          setDuels((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const nextDuel = mapSupabaseDuel(payload.new as SupabaseDuelRow)
        setDuels((items) => {
          const existing = items.filter((item) => item.id !== nextDuel.id)
          return sortDuels([nextDuel, ...existing])
        })
      }),
    })
  }, [])

  useEffect(() => {
    const supabase = getSupabaseDuelsClient()

    if (!supabase) return

    async function loadHistoryData() {
      const [proofResponse, cardsResponse] = await Promise.all([
        supabase.from("proof_log").select("*").order("timestamp", { ascending: false }),
        supabase.from("vault_cards").select("*").order("created_at", { ascending: false }),
      ])

      if (proofResponse.error) {
        setMessage(proofResponse.error.message)
      } else {
        setProofLog(proofResponse.data ?? [])
      }

      if (cardsResponse.error) {
        setMessage(cardsResponse.error.message)
      } else {
        setVaultCards(cardsResponse.data ?? [])
      }
    }

    const removeProofChannel = subscribeWithBackoff({
      supabase,
      label: "duels proof history",
      onSubscribed: () => void loadHistoryData(),
      createChannel: () =>
        supabase.channel(`${PROOF_LOG_REALTIME_CHANNEL}:duels-history`).on("postgres_changes", PROOF_LOG_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<ProofLogRow>
          setProofLog((items) => items.filter((item) => item.event_id !== deleted.event_id))
          return
        }

        const nextProof = payload.new as ProofLogRow
        setProofLog((items) => {
          const existing = items.filter((item) => item.event_id !== nextProof.event_id)
          return [nextProof, ...existing].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        })
      }),
    })

    const removeVaultChannel = subscribeWithBackoff({
      supabase,
      label: "duels vault history",
      createChannel: () =>
        supabase.channel(`${VAULT_CARDS_REALTIME_CHANNEL}:duels-history`).on("postgres_changes", VAULT_CARDS_REALTIME_FILTER, (payload) => {
        if (payload.eventType === "DELETE") {
          const deleted = payload.old as Partial<VaultCardRow>
          setVaultCards((items) => items.filter((item) => item.id !== deleted.id))
          return
        }

        const nextCard = payload.new as VaultCardRow
        setVaultCards((items) => {
          const existing = items.filter((item) => item.id !== nextCard.id)
          return [nextCard, ...existing]
        })
      }),
    })

    return () => {
      removeProofChannel()
      removeVaultChannel()
    }
  }, [])

  async function startDuel(stake: DuelStake) {
    setClaimMessage("")
    setClaimDuelId("")

    if (!wallet) {
      setMessage("Connect Phantom in the nav before starting a duel.")
      return
    }

    const supabase = getSupabaseDuelsClient()
    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    try {
      const payment = await payDuelEntryUsdc(stake)

      const { data, error } = await supabase
        .from("duels")
        .insert({
          id: createEventId(),
          creator_wallet: wallet,
          status: "open",
        })
        .select()
        .single()

      if (error) {
        setMessage(error.message)
        return
      }

      setDuels((items) => sortDuels([mapSupabaseDuel(data), ...items.filter((item) => item.id !== data.id)]))
      console.info("Duel opened after USDC payment", { eventId: data.id, stake, wallet, payment })
      setMessage("Duel opened.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "USDC payment failed.")
    }
  }

  async function cancelDuel(duel: DuelListItem) {
    if (wallet !== duel.playerA || duel.status !== "open") return
    setClaimMessage("")
    setClaimDuelId("")

    const supabase = getSupabaseDuelsClient()
    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    const { error } = await supabase.from("duels").delete().eq("id", duel.id).eq("creator_wallet", wallet).eq("status", "open")
    if (error) {
      setMessage(error.message)
      return
    }

    setDuels((items) => items.filter((item) => item.id !== duel.id))
    setMessage("Duel cancelled.")
  }

  async function acceptDuel(duel: DuelListItem) {
    if (!wallet) {
      setMessage("Connect Phantom in the nav before accepting a duel.")
      return
    }

    if (wallet === duel.playerA) {
      setMessage("Waiting for a different wallet to accept this duel.")
      return
    }

    const supabase = getSupabaseDuelsClient()
    if (!supabase) {
      setMessage("Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setResolvingDuelId(duel.id)
    setClaimMessage("")
    setClaimDuelId("")
    setMessage("Resolving duel.")

    try {
      const payment = await payDuelEntryUsdc(duel.stake)
      console.info("Duel acceptance USDC payment confirmed", { eventId: duel.id, wallet, payment })

      const { data: resolvingDuel, error: resolvingError } = await supabase
        .from("duels")
        .update({ status: "resolving", acceptor_wallet: wallet })
        .eq("id", duel.id)
        .eq("status", "open")
        .select()
        .maybeSingle()

      if (resolvingError) throw resolvingError
      if (!resolvingDuel) throw new Error("This duel is no longer open.")

      setDuels((items) => items.map((item) => (item.id === duel.id ? mapSupabaseDuel(resolvingDuel) : item)))

      const timestamp = new Date().toISOString()
      const resolution = await resolveDuelWithSwitchboardVrf({
        eventId: duel.eventId,
        playerA: duel.playerA,
        playerB: wallet,
        stake: duel.stake,
        timestamp,
      })
      await settleDuelTreasuryReceipt({
        eventId: duel.eventId,
        playerA: duel.playerA,
        playerB: wallet,
      })

      const { data: resolvedDuel, error: resolvedError } = await supabase
        .from("duels")
        .update({
          status: "resolved",
          acceptor_wallet: wallet,
          winner_wallet: resolution.winnerWallet,
          vrf_proof: resolution.vrfProof,
          result_hash: resolution.resultHash,
        })
        .eq("id", duel.id)
        .select()
        .single()

      if (resolvedError) throw resolvedError

      const slabAssignment = await assignAvailableSlab({
        eventId: resolvedDuel.id,
        eventType: "duel_slab_assignment",
        winnerWallet: resolution.winnerWallet,
        vrfProof: resolution.vrfProof,
        resultHash: resolution.resultHash,
        sendSlab: async (sendInput) => {
          console.log("Duel resolved; explicitly sending slab through /api/send-slab", {
            eventId: sendInput.eventId,
            slabId: sendInput.slabId,
            winnerWallet: sendInput.winnerWallet,
            nftMintAddress: sendInput.nftMintAddress,
          })
          const sendResult = await sendSlabToWinner(sendInput)
          console.log("Duel slab /api/send-slab call completed", {
            eventId: sendInput.eventId,
            slabId: sendInput.slabId,
            winnerWallet: sendInput.winnerWallet,
            sendResult,
          })
          return sendResult
        },
      })

      setDuels((items) => items.map((item) => (item.id === duel.id ? mapSupabaseDuel(resolvedDuel) : item)))
      if (slabAssignment.slab) {
        setVaultCards((items) => [
          slabAssignment.slab as VaultCardRow,
          ...items.filter((item) => item.id !== slabAssignment.slab?.id),
        ])
      }
      setProofLog((items) => {
        const existing = items.filter((item) => item.event_id !== slabAssignment.proof.event_id)
        return [slabAssignment.proof, ...existing]
      })
      const wonAssignedSlab = resolution.winnerWallet === wallet && Boolean(slabAssignment.slab)
      setClaimDuelId(wonAssignedSlab ? duel.id : "")
      setMessage(
        wonAssignedSlab
          ? `🏴‍☠️ YOU WON! A slab has been assigned to your wallet — ${slabAssignment.slab?.name} (${slabAssignment.slab?.tier}). We will contact you to arrange shipment.`
          : resolution.winnerWallet === wallet
            ? "🏴‍☠️ YOU WON! Slab assignment is pending."
            : "YOU LOST. Better luck next time pirate.",
      )
      setMessage(
        resolution.winnerWallet === wallet && slabAssignment.slab
          ? formatWinnerMessage(slabAssignment.slab)
          : resolution.winnerWallet === wallet
            ? "🏴‍☠️ YOU WON! Slab assignment is pending."
            : "YOU LOST. Better luck next time pirate.",
      )
    } catch (error) {
      await supabase
        .from("duels")
        .update({ status: "open", acceptor_wallet: null })
        .eq("id", duel.id)
        .eq("status", "resolving")
      setMessage(error instanceof Error ? error.message : "Switchboard VRF resolution failed.")
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
            Duels are priced in USDC on Solana.
          </p>
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-muted-foreground">
          {wallet ? shortWallet(wallet) : "Wallet not connected"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => startDuel(10)}
          className="rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"
        >
          <span className="font-display text-3xl uppercase text-primary">Start $10 Duel</span>
          <span className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-gold" />
            10 USDC entry
          </span>
        </button>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-secondary p-4 text-sm font-medium text-foreground">
          {message}
          {claimDuelId && (
            <div className="mt-4 flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => setClaimMessage("We will contact you to arrange shipment.")}
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
              >
                Claim My Slab
              </button>
              {claimMessage && <div className="text-sm text-muted-foreground">{claimMessage}</div>}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-heading text-lg font-extrabold text-foreground">Open duels waiting for an opponent</h2>
        </div>
        <div className="divide-y divide-border">
          {activeDuels.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No open duels yet.</div>
          ) : (
            activeDuels.map((duel) => (
              <div key={duel.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="grid gap-2 text-sm">
                  <div className="font-mono text-xs text-muted-foreground">{duel.eventId}</div>
                  <div className="font-heading text-xl font-extrabold text-foreground">{duel.stake} USDC</div>
                  <div className="text-muted-foreground">Player A: {shortWallet(duel.playerA)}</div>
                  {duel.playerB && <div className="text-muted-foreground">Player B: {shortWallet(duel.playerB)}</div>}
                  <div className="text-muted-foreground">Status: {duel.status}</div>
                  {duel.winnerWallet && (
                    <div className="text-muted-foreground">Winner: {shortWallet(duel.winnerWallet)}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Created {new Date(duel.createdAt).toLocaleString()}</div>
                </div>
                {duel.status === "open" && wallet === duel.playerA && (
                  <button
                    type="button"
                    onClick={() => cancelDuel(duel)}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                  >
                    Cancel
                  </button>
                )}
                {duel.status === "open" && wallet !== duel.playerA && (
                  <button
                    type="button"
                    onClick={() => acceptDuel(duel)}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                  >
                    Accept Duel
                  </button>
                )}
                {duel.status === "resolving" && (
                  <button
                    type="button"
                    disabled
                    className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
                  >
                    {resolvingDuelId === duel.id ? "Resolving" : "Resolving"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-heading text-lg font-extrabold text-foreground">Settled duels history</h2>
        </div>
        <div className="divide-y divide-border">
          {settledDuels.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No settled duels yet.</div>
          ) : (
            settledDuels.map((duel) => {
              const slab = getAssignedSlab(duel, proofLog, vaultCards)
              const loserWallet = duel.winnerWallet === duel.playerA ? duel.playerB : duel.playerA

              return (
                <div key={`${duel.id}-history`} className="grid gap-3 p-5 text-sm md:grid-cols-5 md:items-center">
                  <div className="font-mono text-xs text-muted-foreground">{duel.eventId}</div>
                  <div className="text-muted-foreground">Winner: {shortWallet(duel.winnerWallet ?? "-")}</div>
                  <div className="text-muted-foreground">Loser: {loserWallet ? shortWallet(loserWallet) : "-"}</div>
                  <div className="text-muted-foreground">{new Date(duel.createdAt).toLocaleDateString()}</div>
                  <div className="text-muted-foreground">{slab}</div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

function getAssignedSlab(duel: DuelListItem, proofLog: ProofLogRow[], vaultCards: VaultCardRow[]) {
  const card = getAssignedSlabCard(duel, proofLog, vaultCards)
  if (card) return `${card.name} (${card.tier})`

  const proof = proofLog.find(
    (record) =>
      record.event_id === duel.eventId &&
      (record.event_type === "duel_slab_assignment" || record.event_type === "no_slab_available"),
  )

  if (!proof?.slab_id) return "Pending"

  return proof.slab_id
}

function getAssignedSlabCard(duel: DuelListItem, proofLog: ProofLogRow[], vaultCards: VaultCardRow[]) {
  const proof = proofLog.find(
    (record) => record.event_id === duel.eventId && record.event_type === "duel_slab_assignment" && record.slab_id,
  )

  if (!proof?.slab_id) return null
  return vaultCards.find((item) => item.id === proof.slab_id) ?? null
}

function formatWinnerMessage(card: VaultCardRow) {
  return `🏴‍☠️ YOU WON! A slab has been assigned — ${card.name} (${card.tier}). We will contact you to arrange shipment.`
}
