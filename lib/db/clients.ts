// lib/db/clients.ts
import { createClient } from "@/lib/supabase/server"

// =====================
// Types
// =====================

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  contact_name: string | null
  phone: string | null
  company: string | null
  address: string | null
  notes: string | null
  default_rate: number | null
  currency: string
  created_at: string
  updated_at: string
}

export interface CreateClientInput {
  name: string
  email?: string | null
  contact_name?: string | null
  phone?: string | null
  company?: string | null
  address?: string | null
  notes?: string | null
}

export interface UpdateClientInput {
  name?: string
  email?: string | null
  contact_name?: string | null
  phone?: string | null
  company?: string | null
  address?: string | null
  notes?: string | null
  default_rate?: number | null
  currency?: string
}

// =====================
// READ: Get all clients
// =====================

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name")

  if (error) {
    console.error("getClients error:", error.message)
    return []
  }

  return data as Client[]
}

// =====================
// READ: Get one client by ID
// =====================

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getClient error:", error.message)
    return null
  }

  return data as Client
}

// Alias for backward compatibility
export async function getClientById(id: string): Promise<Client | null> {
  return getClient(id)
}

// =====================
// CREATE: Add client
// =====================

export async function createClientRecord(
  input: CreateClientInput
): Promise<Client | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      ...input,
      user_id: user.id,
      currency: "USD",
    })
    .select()
    .single()

  if (error) {
    console.error("createClient error:", error.message)
    return null
  }

  return data as Client
}

// =====================
// UPDATE: Edit client (returns updated client)
// =====================

export async function updateClient(
  id: string,
  data: UpdateClientInput
): Promise<Client | null> {
  const supabase = await createClient()

  // Only include fields that are provided (undefined means "do not change")
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (data.name !== undefined) updates.name = data.name
  if (data.email !== undefined) updates.email = data.email
  if (data.contact_name !== undefined) updates.contact_name = data.contact_name
  if (data.phone !== undefined) updates.phone = data.phone
  if (data.company !== undefined) updates.company = data.company
  if (data.address !== undefined) updates.address = data.address
  if (data.notes !== undefined) updates.notes = data.notes
  if (data.default_rate !== undefined) updates.default_rate = data.default_rate
  if (data.currency !== undefined) updates.currency = data.currency

  // Log what we're updating (for debugging)
  console.log(`updateClient: Updating client ${id} with:`, updates)

  const { error, data: updated } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateClient error:", error)
    console.error("updateClient error details:", error.message, error.details, error.hint)
    return null
  }

  console.log(`updateClient: Successfully updated client ${id}`)
  return updated as Client
}

// =====================
// DELETE: Remove client
// =====================

export async function deleteClient(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteClient error:", error.message)
    return false
  }

  return true
}