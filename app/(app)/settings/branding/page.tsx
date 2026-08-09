// app/(app)/settings/branding/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BrandingForm } from "@/components/settings/BrandingForm"

export default async function BrandingSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, business_address, payment_instructions")
    .eq("id", user.id)
    .single()

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-ink mb-2">Invoice Branding</h1>
      <p className="text-slate-mid text-sm mb-8">This appears on every invoice you generate.</p>
      <BrandingForm profile={profile} />
    </div>
  )
}