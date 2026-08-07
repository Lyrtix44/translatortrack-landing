// components/Navbar.tsx
import Link from "next/link"
import { NavAuthButtons } from "@/components/NavAuthButtons"

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-ink tracking-tight">
          Translator<span className="text-amber">Track</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-mid hover:text-ink text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <NavAuthButtons />
      </div>
    </nav>
  )
}