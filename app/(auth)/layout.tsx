// app/(auth)/layout.tsx
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 py-6">
        <Link href="/" className="font-display text-xl text-ink tracking-tight">
          Translator<span className="text-amber">Track</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-12">{children}</main>
    </div>
  )
}