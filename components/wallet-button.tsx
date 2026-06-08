"use client"

import { useEffect, useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONNECTED_WALLET_KEY, shortWallet, WALLET_EVENT } from "@/lib/duel-store"

type PhantomProvider = {
  isPhantom?: boolean
  publicKey?: { toString(): string }
  connect(): Promise<{ publicKey: { toString(): string } }>
}

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null
  const maybeWindow = window as Window & { solana?: PhantomProvider }
  return maybeWindow.solana?.isPhantom ? maybeWindow.solana : null
}

export function WalletButton({ className }: { className?: string }) {
  const [wallet, setWallet] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const stored = window.localStorage.getItem(CONNECTED_WALLET_KEY)
    if (stored) setWallet(stored)
  }, [])

  async function connectWallet() {
    const phantom = getPhantom()

    if (!phantom) {
      setStatus("Install Phantom")
      return
    }

    try {
      const response = await phantom.connect()
      const nextWallet = response.publicKey.toString()
      window.localStorage.setItem(CONNECTED_WALLET_KEY, nextWallet)
      window.dispatchEvent(new Event(WALLET_EVENT))
      setWallet(nextWallet)
      setStatus("")
    } catch {
      setStatus("Connect failed")
    }
  }

  return (
    <Button type="button" className={className} onClick={connectWallet}>
      <Wallet className="h-4 w-4" />
      {wallet ? shortWallet(wallet) : status || "Connect Wallet"}
    </Button>
  )
}
