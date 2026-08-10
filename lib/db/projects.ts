// lib/db/projects.ts
import { createClient } from "@/lib/supabase/server"

export type ProjectStatus = "in_progress" | "delivered" | "invoiced" | "paid"

export interface Project {
  id: string
  user_id: string
  client_id: string
  title: string
  source_language: string
  target_language: string
  word_count: number
  invoice_total: number  // this is read-only from DB, we never write it
  currency: string
  rate_per_word: number
  status: ProjectStatus
  deadline: string | null
  created_at: string
  updated_at: string
  clients?: { name: string; email: string | null; contact_name: string | null } | null
}

export interface CreateProjectInput {
  client_id: string
  title: string
  source_language: string
  target_language: string
  word_count: number
  rate_per_word: number
  currency: string
  deadline: string | null
}

export async function getProjects(filters?: { status?: ProjectStatus }): Promise<Project[]> {
  const supabase = await createClient()

  let query = supabase
    .from("projects")
    .select('*, clients (name, email, contact_name)')
    .order("deadline", { ascending: true, nullsFirst: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error("getProjects error:", error?.message)
    return []
  }

  return data
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select('*, clients (name, email, contact_name)')
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("getProject error:", error?.message)
    return null
  }

  return data
}

export async function createProject(input: CreateProjectInput): Promise<Project | null> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("createProject – user error:", userError)
    return null
  }

  // ❗ Do NOT include invoice_total – it's a generated column!
  const dataToInsert = {
    user_id: user.id,
    client_id: input.client_id,
    title: input.title,
    source_language: input.source_language,
    target_language: input.target_language,
    word_count: input.word_count,
    rate_per_word: input.rate_per_word,
    currency: input.currency,
    deadline: input.deadline,
    status: "in_progress",
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(dataToInsert)
    .select()
    .single()

  if (error) {
    console.error("createProject error:", error.message)
    return null
  }

  return data
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("updateProjectStatus error:", error?.message)
    return false
  }
  return true
}

export async function updateProject(
  id: string,
  input: Partial<CreateProjectInput>
): Promise<Project | null> {
  const supabase = await createClient()

  const current = await getProject(id)
  if (!current) return null

  // Build update object – again, no invoice_total
  const updates: any = {}

  if (input.client_id !== undefined) updates.client_id = input.client_id
  if (input.title !== undefined) updates.title = input.title
  if (input.source_language !== undefined) updates.source_language = input.source_language
  if (input.target_language !== undefined) updates.target_language = input.target_language
  if (input.word_count !== undefined) updates.word_count = input.word_count
  if (input.rate_per_word !== undefined) updates.rate_per_word = input.rate_per_word
  if (input.currency !== undefined) updates.currency = input.currency
  if (input.deadline !== undefined) updates.deadline = input.deadline
  // updated_at will be set automatically if you have a trigger, or we can set it manually:
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateProject error:", error.message)
    return null
  }

  return data
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const { data } = await supabase
    .from("projects")
    .select("word_count, invoice_total, status, deadline, created_at")

  if (!data) {
    return {
      wordsThisMonth: 0, wordsChange: null,
      revenueThisMonth: 0, revenueChange: null,
      activeProjects: 0, overdueProjects: 0,
    }
  }

  const thisMonth = data.filter((p) => new Date(p.created_at) >= monthStart)
  const lastMonth = data.filter((p) => {
    const d = new Date(p.created_at)
    return d >= lastMonthStart && d < monthStart
  })

  const wordsThisMonth = thisMonth.reduce((s, p) => s + p.word_count, 0)
  const wordsLastMonth = lastMonth.reduce((s, p) => s + p.word_count, 0)
  const revenueThisMonth = thisMonth.reduce((s, p) => s + Number(p.invoice_total), 0)
  const revenueLastMonth = lastMonth.reduce((s, p) => s + Number(p.invoice_total), 0)

  function pctChange(current: number, previous: number): number | null {
    if (previous === 0) return null
    return Math.round(((current - previous) / previous) * 100)
  }

  return {
    wordsThisMonth,
    wordsChange: pctChange(wordsThisMonth, wordsLastMonth),
    revenueThisMonth,
    revenueChange: pctChange(revenueThisMonth, revenueLastMonth),
    activeProjects: data.filter((p) => p.status === "in_progress").length,
    overdueProjects: data.filter(
      (p) => p.deadline && new Date(p.deadline) < now && p.status !== "paid"
    ).length,
  }
}

export async function getRevenueByClient(limit = 5) {
  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("invoice_total, clients(name)")
  if (!data) return []

  const totals = new Map<string, number>()
  for (const row of data) {
    const name = (row.clients as { name: string }[] | null)?.[0]?.name ?? "Unknown"
    totals.set(name, (totals.get(name) ?? 0) + Number(row.invoice_total))
  }

  return Array.from(totals.entries())
    .map(([clientName, revenue]) => ({ clientName, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}