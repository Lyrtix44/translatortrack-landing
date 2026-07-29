"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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

    // This UPDATE only succeeds because of the Week 5 RLS policy:
    // "Users can update own profile" — USING (id = auth.uid())
    const { error } = await supabase
      .from("profiles")
      .update({
        default_currency: currency,
        default_rate: parseFloat(rate),
      })
      .eq("id", user.id)

    setLoading(false)
    if (!error) router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">
            One quick thing
          </h1>
          <p className="text-slate-mid text-sm">
            Set your defaults — you can change these anytime per client.
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Default currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-paper"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Default rate (per word)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-ink bg-paper"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-ink hover:bg-ink-light text-white font-semibold py-5"
          >
            {loading ? "Saving..." : "Continue to dashboard →"}
          </Button>
        </div>
      </div>
    </div>
  )
}