// components/auth/ResetPasswordForm.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError("Something went wrong. Please try again.")
      return
    }
    router.push("/login")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-danger-light border border-danger/20 text-danger text-sm rounded px-4 py-3" role="alert">
          {error}
        </div>
      )}
      <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full">
        {loading ? "Saving..." : "Update password"}
      </Button>
    </form>
  )
}