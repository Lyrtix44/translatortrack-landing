// app/(app)/pricing/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UpgradeButton } from "@/components/billing/UpgradeButton"
import { Card } from "@/components/ui/card"

const PLANS = [
  { key: "free", name: "Free", price: 0, priceId: "", blurb: "Up to 5 active projects" },
  { key: "pro", name: "Pro", price: 19, priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO || "", blurb: "Unlimited projects" },
  { key: "studio", name: "Studio", price: 49, priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STUDIO || "", blurb: "Up to 3 team members" },
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("plan, cancels_at").eq("id", user.id).single()

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Plans</h1>
      <p className="text-slate-mid text-sm mb-8">
        You&apos;re currently on the <strong className="text-ink capitalize">{profile?.plan}</strong> plan.
        {profile?.cancels_at && (
          <span className="text-warning"> Cancels on {new Date(profile.cancels_at).toLocaleDateString()}.</span>
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {PLANS.map((plan) => (
          <Card key={plan.key} className="p-6">
            <h3 className="font-semibold text-ink text-lg">{plan.name}</h3>
            <p className="font-display text-3xl text-ink my-3">
              ${plan.price}
              <span className="text-sm text-slate-mid font-sans">/mo</span>
            </p>
            <p className="text-slate-mid text-sm mb-4">{plan.blurb}</p>
            {profile?.plan === plan.key ? (
              <div className="text-center text-sm text-slate-mid py-2.5 border border-border rounded-lg">Current plan</div>
            ) : plan.priceId ? (
              <UpgradeButton 
                priceId={plan.priceId as string}   // ✅ assertion – we know it's truthy
                planName={plan.name} 
                userEmail={user.email} 
                userId={user.id} 
              />
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  )
}