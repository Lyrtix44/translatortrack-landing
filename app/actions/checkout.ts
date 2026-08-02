// app/actions/checkout.ts
"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function startCheckoutAction(formData: FormData) {
  const priceId = formData.get("priceId") as string

  if (!priceId) {
    throw new Error("Missing Paddle price ID.")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Without this check, anyone could call this Server Action directly and obtain authenticated checkout data without being signed in.
  if (!user) {
    redirect("/login")
  }

  // Return the authenticated user's information.
  // The client-side UpgradeButton uses this to open Paddle Checkout.
  return {
    priceId,
    userId: user.id,
    userEmail: user.email!,
  }
}