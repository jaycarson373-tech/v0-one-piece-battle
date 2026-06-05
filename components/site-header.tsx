"use client"

import { useState } from "react"
import { Menu, X, Wallet } from "lucide-react"
import { Logo } from "./logo"
import { navLinks } from "@/lib/data"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" aria-label="One Piece Battle home">
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
              {link.label === "Bounties" && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden gap-2 rounded-full sm:inline-flex">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                </a>
              </li>
            ))}
          </ul>
          <Button className="mt-3 w-full gap-2 rounded-full sm:hidden">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </nav>
      )}
    </header>
  )
}
