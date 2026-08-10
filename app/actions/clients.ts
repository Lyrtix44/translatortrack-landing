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
  console.log("createClientAction: Starting...")
  
  await requireAuth()

  const name = (formData.get("name") as string)?.trim()
  const email = formData.get("email") as string

  console.log("createClientAction: Parsed data:", { name, email })

  if (!name || name.length < 2) {
    console.log("createClientAction: Validation failed - name is required")
    return { error: "Client name is required.", success: false }
  }

  const client = await createClientRecord({
    name,
    email: email || null,
  })

  if (!client) {
    console.error("createClientAction: createClientRecord returned null")
    return { error: "Couldn't save the client. Please try again.", success: false }
  }

  console.log("createClientAction: Successfully created client:", client.id)
  revalidatePath("/clients")
  return { error: null, success: true }
}

// ✨ NEW: Update an existing client
export async function updateClientAction(
  clientId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  console.log("updateClientAction: Starting for clientId:", clientId)
  
  await requireAuth()

  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim() || null
  const defaultRate = formData.get("default_rate") as string
  const currency = (formData.get("currency") as string) || "USD"

  console.log("updateClientAction: Parsed data:", {
    clientId,
    name,
    email,
    defaultRate,
    currency,
  })

  if (!name || name.length < 2) {
    console.log("updateClientAction: Validation failed - name is required")
    return { success: false, error: "Client name is required." }
  }

  console.log("updateClientAction: Calling updateClient with:", {
    id: clientId,
    data: {
      name,
      email,
      default_rate: defaultRate ? parseFloat(defaultRate) : null,
      currency,
    },
  })

  const client = await updateClient(clientId, {
    name,
    email,
    default_rate: defaultRate ? parseFloat(defaultRate) : null,
    currency,
  })

  if (!client) {
    console.error("updateClientAction: updateClient returned null for clientId:", clientId)
    return { success: false, error: "Couldn't update client." }
  }

  console.log("updateClientAction: Successfully updated client:", client.id)

  revalidatePath("/clients")
  revalidatePath(`/clients/${clientId}`)
  return { success: true }
}