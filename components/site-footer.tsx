import { Logo } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground" aria-label="Footer">
          <a href="#" className="hover:text-foreground">
            @KingOfThePirates
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
        </nav>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          King of the Pirates is an independent fan-made crypto game and card vault experience. It is not
          affiliated with Eiichiro Oda, Shueisha, Toei Animation, Bandai, One Piece, or any official rights
          holder. All card references are for collectible identification only. Eligibility, rewards, and game
          mechanics are experimental and may be restricted by jurisdiction. Nothing on this website is
          financial, legal, or professional advice.
        </p>
      </div>
    </footer>
  )
}
