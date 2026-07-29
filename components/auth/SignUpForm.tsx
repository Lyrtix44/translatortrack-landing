"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "An account with this email already exists. Try logging in instead."
          : error.message
      )
      return
    }

    router.push("/check-email")
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
          Full name
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Maria Santos"
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="maria@example.com"
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-ink hover:bg-ink-light text-white font-semibold py-5"
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}