// app/(auth)/onboarding/page.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currency, setCurrency] = useState("USD")
  const [rate, setRate] = useState("0.10")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    await supabase.from("profiles").update({ default_currency: currency, default_rate: parseFloat(rate) }).eq("id", user.id)
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">One quick thing</h1>
        <p className="text-slate-mid text-sm">Set your defaults — you can change these anytime per client.</p>
      </div>
      <Card className="p-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Default currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-border rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">Default rate (per word)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full border border-border rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading} variant="primary" size="lg" className="w-full">
          {loading ? "Saving..." : "Continue to dashboard →"}
        </Button>
      </Card>
    </div>
  )
}