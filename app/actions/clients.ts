// app/actions/clients.ts
"use server"
import { createClientRecord, updateClient } from "@/lib/db/clients"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePath } from "next/cache"

export interface ClientFormState {
  error: string | null
  success: boolean
}

export async function createClientAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAuth()

  const name = (formData.get("name") as string)?.trim()
  const email = formData.get("email") as string

  if (!name || name.length < 2) {
    return { error: "Client name is required.", success: false }
  }

  const client = await createClientRecord({
    name,
    email: email || null,
  })

  if (!client) {
    return { error: "Couldn't save the client. Please try again.", success: false }
  }

  revalidatePath("/clients")
  return { error: null, success: true }
}

// ✨ NEW: Update an existing client
export async function updateClientAction(
  clientId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim() || null
  const defaultRate = formData.get("default_rate") as string
  const currency = (formData.get("currency") as string) || "USD"

  if (!name || name.length < 2) {
    return { success: false, error: "Client name is required." }
  }

  const client = await updateClient(clientId, {
    name,
    email,
    default_rate: defaultRate ? parseFloat(defaultRate) : null,
    currency,
  })

  if (!client) {
    return { success: false, error: "Couldn't update client." }
  }

  revalidatePath("/clients")
  revalidatePath(`/clients/${clientId}`)
  return { success: true }
}