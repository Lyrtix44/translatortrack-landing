"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setError(
        error.message.includes("Invalid login credentials")
          ? "Incorrect email or password. Please try again."
          : error.message.includes("Email not confirmed")
          ? "Please confirm your email before logging in — check your inbox."
          : "Something went wrong. Please try again."
      )
      return
    }

    const redirectTo = searchParams.get("redirectTo") || "/dashboard"
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider">
            Password
          </label>
          <a href="/forgot-password" className="text-xs text-ink hover:text-amber transition-colors">
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-ink hover:bg-ink-light text-white font-semibold py-5"
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}