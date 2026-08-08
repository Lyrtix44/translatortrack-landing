// components/auth/SignUpForm.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
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
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
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
        <div className="bg-danger-light border border-danger/20 text-danger text-sm rounded px-4 py-3" role="alert">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Full name</label>
        <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Maria Santos" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Email</label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@example.com" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Password</label>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
      </div>
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full">
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}