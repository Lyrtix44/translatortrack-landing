"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getFreshCustomerPortalUrl } from "@/lib/paddle/customer-portal"

export async function manageBillingAction() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Without this check, anyone could call this Server Action directly and attempt to access the billing portal without being signed in.
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("paddle_customer_id, paddle_subscription_id")
    .eq("id", user.id)
    .single()

  if (!profile?.paddle_customer_id) {
    redirect("/pricing")
  }

  const portalUrl = await getFreshCustomerPortalUrl(
    profile.paddle_customer_id,
    profile.paddle_subscription_id ?? undefined
  )

  if (!portalUrl) {
    throw new Error("Couldn't open the billing portal. Please try again.")
  }

  redirect(portalUrl)
}