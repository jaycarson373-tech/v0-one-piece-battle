import { Logo } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground" aria-label="Footer">
          <a href="#" className="hover:text-foreground">
            @OnePiece_Battle
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
        </nav>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          18+ where legal. Not financial advice. Not affiliated with Eiichiro Oda, Shueisha, Toei Animation, or
          Bandai. One Piece is a trademark of its respective owners.
        </p>
      </div>
    </footer>
  )
}
