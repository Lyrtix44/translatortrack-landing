// app/not-found.tsx

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-6xl text-ink mb-4">
          404
        </p>

        <p className="text-slate-mid mb-6">
          This page doesn't exist.
        </p>

        <Link
          href="/dashboard"
          className="text-ink font-medium hover:text-amber transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}