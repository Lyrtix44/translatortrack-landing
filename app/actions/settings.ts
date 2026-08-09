// app/actions/settings.ts
"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"

export interface AccountFormState {
  error: string | null
  success: boolean
}

export async function updateAccountAction(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const user = await requireAuth()
  const supabase = await createClient()

  const fullName = (formData.get("full_name") as string)?.trim()
  const defaultCurrency = formData.get("default_currency") as string
  const defaultRate = formData.get("default_rate") as string

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your name.", success: false }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      display_name: fullName,
      default_currency: defaultCurrency,
      default_rate: defaultRate ? parseFloat(defaultRate) : null,
    })
    .eq("id", user.id)

  if (error) return { error: "Couldn't save changes. Please try again.", success: false }
  revalidatePath("/settings/account")
  return { error: null, success: true }
}

export interface BrandingFormState {
  error: string | null
  success: boolean
}

export async function updateBrandingAction(
  _prev: BrandingFormState,
  formData: FormData
): Promise<BrandingFormState> {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      business_name: (formData.get("business_name") as string)?.trim() || null,
      business_address: (formData.get("business_address") as string)?.trim() || null,
      payment_instructions: (formData.get("payment_instructions") as string)?.trim() || null,
    })
    .eq("id", user.id)

  if (error) return { error: "Couldn't save changes.", success: false }
  revalidatePath("/settings/branding")
  return { error: null, success: true }
}