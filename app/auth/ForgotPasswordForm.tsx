// components/auth/ForgotPasswordForm.tsx
"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ForgotPasswordForm() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    setLoading(false)
    setSent(true) // identical outcome regardless of whether the account exists — Week 6
  }

  if (sent) {
    return <p className="text-sm text-ink text-center py-4">If an account exists for that email, a reset link is on its way.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full">
        {loading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  )
}