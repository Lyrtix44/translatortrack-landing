// lib/db/invoices.ts
import { createClient } from "@/lib/supabase/server"
import { getProject, updateProjectStatus } from "./projects"

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

export interface Invoice {
  id: string
  user_id: string
  project_id: string
  client_id: string
  invoice_number: string
  amount: number
  currency: string
  status: InvoiceStatus
  issued_at: string | null
  due_at: string | null
  paid_at: string | null
  payment_terms: number
  notes: string | null
  created_at: string
  email_sent_at: string | null
}

// Create an invoice pre-filled from project data
export async function createInvoiceFromProject(
  projectId: string
): Promise<Invoice | null> {
  const supabase = await createClient()

  const project = await getProject(projectId)
  if (!project) return null

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })

  const year = new Date().getFullYear()
  const invoiceNumber = `INV-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id: project.user_id,
      project_id: project.id,
      client_id: project.client_id,
      invoice_number: invoiceNumber,
      amount: project.invoice_total,
      currency: project.currency,
      status: "draft",
      payment_terms: 30,
      due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      email_sent_at: null,
    })
    .select()
    .single()

  if (error) {
    console.error("createInvoiceFromProject error:", error.message)
    return null
  }

  await updateProjectStatus(projectId, "invoiced")
  return data as Invoice
}

// Mark invoice as sent
export async function markInvoiceSent(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent", issued_at: new Date().toISOString() })
    .eq("id", id)
  return !error
}

// Mark invoice as paid
export async function markInvoicePaid(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id)

  if (!error) {
    const { data: invoice } = await supabase
      .from("invoices")
      .select("project_id")
      .eq("id", id)
      .single()
    if (invoice?.project_id) {
      await updateProjectStatus(invoice.project_id, "paid")
    }
  }
  return !error
}

// ✨ NEW: Update any 'sent' invoices whose due_at is in the past to 'overdue'
export async function updateOverdueInvoices(): Promise<number> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "overdue" })
    .eq("status", "sent")
    .lt("due_at", now)
    .select()

  if (error) {
    console.error("updateOverdueInvoices error:", error)
    return 0
  }
  return data?.length || 0
}

// Get all overdue invoices (legacy, kept for compatibility)
export async function getOverdueInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .lt("due_at", new Date().toISOString())
    .neq("status", "paid")
    .order("due_at", { ascending: true })

  if (error) {
    console.error("getOverdueInvoices error:", error.message)
    return []
  }
  return data as Invoice[]
}

// Get total outstanding payments (sent or overdue)
export async function getOutstandingPayments(): Promise<{ total: number; count: number }> {
  const supabase = await createClient()
  const { data } = await supabase.from("invoices").select("amount").in("status", ["sent", "overdue"])
  if (!data) return { total: 0, count: 0 }

  return {
    total: data.reduce((sum, inv) => sum + Number(inv.amount), 0),
    count: data.length,
  }
}

// ✨ Get all invoices – also automatically updates overdue status
export async function getInvoices(): Promise<
  (Invoice & { clientName: string; clients?: { email: string | null } | null })[]
> {
  // First, update any overdue invoices
  await updateOverdueInvoices()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error("getInvoices error:", error?.message)
    return []
  }

  return data.map((inv) => ({
    ...inv,
    clientName: (inv.clients as { name: string } | null)?.name ?? "Unknown",
    clients: inv.clients as { name: string; email: string | null } | null,
  }))
}

// ✨ Get all invoices for a specific project
export async function getInvoicesByProject(projectId: string): Promise<Invoice[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error("getInvoicesByProject error:", error?.message)
    return []
  }
  return data as Invoice[]
}