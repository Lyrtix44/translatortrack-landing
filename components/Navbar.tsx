import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-ink font-display text-xl tracking-tight">
            Translator<span className="text-amber">Track</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-slate-mid hover:text-ink text-sm font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-slate-mid hover:text-ink text-sm font-medium transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-slate-mid hover:text-ink text-sm font-medium transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden md:flex text-slate-mid hover:text-ink text-sm"
          >
            Sign in
          </Button>
          <Button
            className="bg-ink hover:bg-ink-light text-white font-semibold text-sm px-5 py-2 rounded-lg"
          >
            Get early access →
          </Button>
        </div>

      </div>
    </nav>
  )
}