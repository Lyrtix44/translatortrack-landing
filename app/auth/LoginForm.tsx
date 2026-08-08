// components/auth/LoginForm.tsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
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

    router.push(searchParams.get("redirectTo") || "/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-danger-light border border-danger/20 text-danger text-sm rounded px-4 py-3" role="alert">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Email</label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider">Password</label>
          <Link href="/forgot-password" className="text-xs text-ink hover:text-amber transition-colors">
            Forgot password?
          </Link>
        </div>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}