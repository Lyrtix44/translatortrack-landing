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
// READ: Get one client
// =====================

export async function getClientById(
  id: string
): Promise<Client | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getClientById error:", error.message)
    return null
  }

  return data as Client
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
// UPDATE: Edit client
// =====================

export async function updateClient(
  id: string,
  updates: UpdateClientInput
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("clients")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("updateClient error:", error.message)
    return false
  }

  return true
}

// =====================
// DELETE: Remove client
// =====================

export async function deleteClient(
  id: string
): Promise<boolean> {
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