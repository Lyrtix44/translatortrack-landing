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
  data: {
    name?: string
    email?: string | null
    default_rate?: number | null
    currency?: string
  }
): Promise<Client | null> {
  const supabase = await createClient()

  const { error, data: updated } = await supabase
    .from("clients")
    .update({
      name: data.name,
      email: data.email,
      default_rate: data.default_rate,
      currency: data.currency,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateClient error:", error.message)
    return null
  }
  return updated as Client
}

// =====================
// UPDATE: Full client update (with all fields)
// =====================

export async function updateClientFull(
  id: string,
  updates: UpdateClientInput
): Promise<Client | null> {
  const supabase = await createClient()

  const { error, data: updated } = await supabase
    .from("clients")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateClientFull error:", error.message)
    return null
  }
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