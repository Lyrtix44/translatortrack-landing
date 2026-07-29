import Link from "next/link"
import { NavAuthButtons } from "@/components/NavAuthButtons"

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

        <NavAuthButtons />

      </div>
    </nav>
  )
}