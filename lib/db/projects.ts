import { createClient } from "@/lib/supabase/server"

// Types
export type ProjectStatus = "in_progress" | "delivered" | "invoiced" | "paid"

export interface Project {
  id: string
  user_id: string
  client_id: string
  title: string
  source_language: string
  target_language: string
  word_count: number
  rate_per_word: number
  invoice_total: number
  currency: string
  status: ProjectStatus
  deadline: string | null
  delivered_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  clients?: {
    name: string
    email: string | null
    contact_name: string | null
  }
}

export interface CreateProjectInput {
  client_id: string
  title: string
  source_language: string
  target_language: string
  word_count: number
  rate_per_word: number
  currency: string
  deadline?: string | null
  notes?: string | null
}

// READ: Get all projects for the logged-in user
export async function getProjects(filters?: {
  status?: ProjectStatus
  client_id?: string
}): Promise<Project[]> {
  const supabase = await createClient()

  let query = supabase
    .from("projects")
    .select(`*, clients (name, email, contact_name)`)
    .order("deadline", { ascending: true, nullsFirst: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.client_id) {
    query = query.eq("client_id", filters.client_id)
  }

  const { data, error } = await query

  if (error) {
    console.error("getProjects error:", error.message)
    return []
  }

  return data as Project[]
}

// READ: Get a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select(`*, clients (name, email, contact_name)`)
    .eq("id", id)
    .single()

  if (error) {
    console.error("getProjectById error:", error.message)
    return null
  }

  return data as Project
}

// CREATE: Add a new project
export async function createProject(input: CreateProjectInput): Promise<Project | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...input, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error("createProject error:", error.message)
    return null
  }

  return data as Project
}

// UPDATE: Change project fields
export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<boolean> {
  const supabase = await createClient()

  const updates: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "delivered") {
    updates.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)

  if (error) {
    console.error("updateProjectStatus error:", error.message)
    return false
  }

  return true
}

// DELETE: Remove a project
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteProject error:", error.message)
    return false
  }

  return true
}

// DASHBOARD: Aggregate stats
export async function getProjectStats() {
  const supabase = await createClient()
  const now = new Date()

  const { data, error } = await supabase
    .from("projects")
    .select("word_count, invoice_total, status, deadline, created_at")

  if (error || !data) {
    return { totalWordsThisMonth: 0, revenueThisMonth: 0, activeProjects: 0, overdueProjects: 0 }
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thisMonth = data.filter(p => p.created_at >= monthStart)

  return {
    totalWordsThisMonth: thisMonth.reduce((sum, p) => sum + p.word_count, 0),
    revenueThisMonth: thisMonth.reduce((sum, p) => sum + Number(p.invoice_total), 0),
    activeProjects: data.filter(p => p.status === "in_progress").length,
    overdueProjects: data.filter(p =>
      p.deadline &&
      new Date(p.deadline) < now &&
      p.status !== "paid"
    ).length,
  }
}