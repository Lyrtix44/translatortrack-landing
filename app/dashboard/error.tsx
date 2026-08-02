// app/dashboard/error.tsx

"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
    // Later you could send this to Sentry or another error tracking service.
  }, [error])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-4xl mb-4">⚠️</p>

        <h2 className="font-display text-2xl text-ink mb-2">
          Something went wrong
        </h2>

        <p className="text-slate-mid text-sm mb-6">
          We hit a snag loading your dashboard. It's been logged — try again.
        </p>

        <Button
          onClick={reset}
          className="bg-ink hover:bg-ink-light text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}