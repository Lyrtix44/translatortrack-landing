import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-paper border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div>
          <Link href="/" className="font-display text-xl text-ink">
            Translator<span className="text-amber">Track</span>
          </Link>
          <p className="text-slate-mid text-xs mt-1">
            Project management built for freelance translators.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <Link href="#features" className="text-slate-mid hover:text-ink text-sm transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-slate-mid hover:text-ink text-sm transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-slate-mid hover:text-ink text-sm transition-colors">
            FAQ
          </Link>
          <Link href="mailto:drewsinclair14@gmail.com" className="text-slate-mid hover:text-ink text-sm transition-colors">
            Contact
          </Link>
        </div>

        <p className="text-slate-mid text-xs">
          © 2025 TranslatorTrack. Built by a solo founder.
        </p>

      </div>
    </footer>
  )
}