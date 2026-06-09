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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(CONNECTED_WALLET_KEY)
    if (stored) setWallet(stored)
  }, [])

  async function connectWallet() {
    if (wallet) {
      setOpen((value) => !value)
      return
    }

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

  function disconnectWallet() {
    window.localStorage.removeItem(CONNECTED_WALLET_KEY)
    window.dispatchEvent(new Event(WALLET_EVENT))
    setWallet("")
    setStatus("")
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button type="button" className={`${className ?? ""} cursor-pointer`} onClick={connectWallet}>
        <Wallet className="h-4 w-4" />
        {wallet ? shortWallet(wallet) : status || "Connect Wallet"}
      </Button>
      {wallet && open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-xl border border-border bg-card p-2 shadow-lg">
          <button
            type="button"
            onClick={disconnectWallet}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
