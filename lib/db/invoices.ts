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
}

// Create an invoice pre-filled from project data
export async function createInvoiceFromProject(
  projectId: string
): Promise<Invoice | null> {
  const supabase = await createClient()

  // 1. Fetch the project
  const project = await getProject(projectId)
  if (!project) return null

  // 2. Generate invoice number: INV-2025-001
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })

  const year = new Date().getFullYear()
  const invoiceNumber = `INV-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`

  // 3. Create the invoice
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
    })
    .select()
    .single()

  if (error) {
    console.error("createInvoiceFromProject error:", error.message)
    return null
  }

  // 4. Update the project status to "invoiced"
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
    // Also update the linked project to "paid"
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

// Get all overdue invoices
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

// ✨ NEW: Get all invoices with client name for the list page
export async function getInvoices(): Promise<(Invoice & { clientName: string })[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error("getInvoices error:", error?.message)
    return []
  }

  return data.map((inv) => ({
    ...inv,
    clientName: (inv.clients as { name: string } | null)?.name ?? "Unknown",
  }))
}