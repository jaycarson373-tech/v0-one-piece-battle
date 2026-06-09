"use client"

import { useState } from "react"
import { Menu, X as XIcon } from "lucide-react"
import { Logo } from "./logo"
import { navLinks } from "@/lib/data"
import { WalletButton } from "@/components/wallet-button"

const CONTRACT_ADDRESS = "4KvrMmVDWpmUvQsRxVnWS8RQkByJZqfYyfL3RpQNpump"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyContractAddress() {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" aria-label="King of the Pirates home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              {link.label === "Duels" && (
                <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 align-middle" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://x.com/KOTPirates_"
            target="_blank"
            rel="noreferrer"
            aria-label="King of the Pirates on X"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <XIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={copyContractAddress}
            className="hidden cursor-pointer rounded-full border border-border px-3 py-2 font-mono text-xs font-bold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            aria-label="Copy contract address"
            title={CONTRACT_ADDRESS}
          >
            {copied ? "Copied" : `CA: ${CONTRACT_ADDRESS}`}
          </button>
          <WalletButton className="hidden gap-2 rounded-full sm:inline-flex" />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                  {link.label === "Duels" && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 align-middle" />
                  )}
                </a>
              </li>
            ))}
          </ul>
          <WalletButton className="mt-3 w-full gap-2 rounded-full sm:hidden" />
        </nav>
      )}
    </header>
  )
}
