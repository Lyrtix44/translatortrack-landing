// app/actions/invoices.ts
"use server"
import { revalidatePath } from "next/cache"
import { markInvoiceSent, markInvoicePaid, createInvoiceFromProject, getInvoice } from "@/lib/db/invoices"
import { requireAuth } from "@/lib/auth/require-auth"
import { createClient } from "@/lib/supabase/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoices/InvoicePDF"
import { sendInvoiceEmail } from "@/lib/email/sendInvoiceEmail"

// Existing actions...

export async function markInvoiceSentAction(invoiceId: string): Promise<boolean> {
  await requireAuth()
  const ok = await markInvoiceSent(invoiceId)
  if (ok) revalidatePath("/invoices")
  return ok
}

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

export async function generateInvoiceAction(projectId: string) {
  await requireAuth()
  const invoice = await createInvoiceFromProject(projectId)
  if (invoice) {
    revalidatePath("/invoices")
    revalidatePath("/projects")
  }
  return { invoice, error: invoice ? null : "Couldn't generate the invoice." }
}

// ✨ NEW: Send invoice email and mark as sent
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

  // 5. Mark invoice as sent (only if email succeeded)
  const sent = await markInvoiceSent(invoiceId)
  if (sent) {
    revalidatePath("/invoices")
    revalidatePath(`/invoices/${invoiceId}`)
    return { success: true }
  } else {
    return { success: false, error: "Invoice sent but status update failed." }
  }
}