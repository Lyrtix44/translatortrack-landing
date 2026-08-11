// app/actions/invoices.tsx
"use server"
import { revalidatePath } from "next/cache"
import {
  markInvoiceSent,
  markInvoicePaid,
  createInvoiceFromProject,
} from "@/lib/db/invoices"
import { requireAuth } from "@/lib/auth/require-auth"
import { createClient } from "@/lib/supabase/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoices/InvoicePDF"
import { sendInvoiceEmail } from "@/lib/email/sendInvoiceEmail"
import type { InvoiceStatus } from "@/lib/db/invoices"

// ============================================
// 1. Mark as sent (legacy, used by some places)
// ============================================
export async function markInvoiceSentAction(invoiceId: string): Promise<boolean> {
  await requireAuth()
  const ok = await markInvoiceSent(invoiceId)
  if (ok) revalidatePath("/invoices")
  return ok
}

// ============================================
// 2. Mark as paid
// ============================================
export async function markInvoicePaidAction(invoiceId: string): Promise<boolean> {
  await requireAuth()
  const ok = await markInvoicePaid(invoiceId)
  if (ok) {
    revalidatePath("/invoices")
    revalidatePath("/projects")
    revalidatePath("/dashboard")
  }
  return ok
}

// ============================================
// 3. Mark as sent manually (without email)
// ============================================
export async function markInvoiceSentManuallyAction(invoiceId: string): Promise<boolean> {
  await requireAuth()
  const ok = await markInvoiceSent(invoiceId)
  if (ok) {
    revalidatePath("/invoices")
    revalidatePath(`/invoices/${invoiceId}`)
  }
  return ok
}

// ============================================
// 4. Generate invoice from a project
// ============================================
export async function generateInvoiceAction(projectId: string) {
  await requireAuth()
  const invoice = await createInvoiceFromProject(projectId)
  if (invoice) {
    revalidatePath("/invoices")
    revalidatePath("/projects")
  }
  return { invoice, error: invoice ? null : "Couldn't generate the invoice." }
}

// ============================================
// 5. Send invoice email + mark as sent (Resend API)
// ============================================
export async function sendInvoiceAction(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  const user = await requireAuth()
  const supabase = await createClient()

  // 1. Fetch the invoice with client details
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, clients(id, name, email)")
    .eq("id", invoiceId)
    .single()

  if (invoiceError || !invoice) {
    return { success: false, error: "Invoice not found." }
  }

  // 2. Fetch the user's branding info
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, business_address, payment_instructions")
    .eq("id", user.id)
    .single()

  // 3. Generate PDF
  const pdfBuffer = await renderToBuffer(
    <InvoicePDF
      invoice={{
        ...invoice,
        clientName: (invoice.clients as { name: string } | null)?.name ?? "Unknown",
      }}
      businessName={profile?.business_name}
      businessAddress={profile?.business_address}
      paymentInstructions={profile?.payment_instructions}
    />
  )

  // 4. Send email
  const clientEmail = (invoice.clients as { email: string } | null)?.email
  if (!clientEmail) {
    return { success: false, error: "Client has no email address." }
  }

  try {
    await sendInvoiceEmail({
      invoice: {
        ...invoice,
        clientName: (invoice.clients as { name: string } | null)?.name ?? "Unknown",
      },
      clientEmail,
      pdfBuffer: pdfBuffer as Buffer,
      businessName: profile?.business_name,
    })
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: "Failed to send email. Please try again." }
  }

  // 5. Update invoice: status = sent, issued_at, and email_sent_at
  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "sent",
      issued_at: now,
      email_sent_at: now,
    })
    .eq("id", invoiceId)

  if (updateError) {
    console.error("Failed to update invoice after email:", updateError)
    return { success: false, error: "Email sent but failed to update invoice status." }
  }

  // 6. Revalidate paths
  revalidatePath("/invoices")
  revalidatePath(`/invoices/${invoiceId}`)
  revalidatePath("/dashboard")

  return { success: true }
}

// ============================================
// 6. Update invoice status directly (used by dropdown)
// ============================================
export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: InvoiceStatus
): Promise<boolean> {
  await requireAuth()
  const supabase = await createClient()

  const updateData: any = {
    status,
    paid_at: status === "paid" ? new Date().toISOString() : null,
  }

  // Only set issued_at if changing to "sent"
  if (status === "sent") {
    updateData.issued_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", invoiceId)

  if (error) {
    console.error("updateInvoiceStatus error:", error.message)
    return false
  }

  revalidatePath("/invoices")
  revalidatePath("/dashboard")
  return true
}

// ============================================
// 7. Mark invoice as sent + set email_sent_at (for mailto flow)
// ============================================
export async function markInvoiceSentAndEmailAction(
  invoiceId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAuth()
  const supabase = await createClient()

  const now = new Date().toISOString()
  const { error } = await supabase
    .from("invoices")
    .update({
      status: "sent",
      issued_at: now,
      email_sent_at: now,
    })
    .eq("id", invoiceId)

  if (error) {
    console.error("markInvoiceSentAndEmailAction error:", error)
    return { success: false, error: "Failed to update invoice." }
  }

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${invoiceId}`)
  revalidatePath("/dashboard")
  return { success: true }
}