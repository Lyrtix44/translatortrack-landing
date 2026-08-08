// app/actions/invoices.ts
"use server"
import { revalidatePath } from "next/cache"
import { markInvoiceSent, markInvoicePaid, createInvoiceFromProject } from "@/lib/db/invoices"
import { requireAuth } from "@/lib/auth/require-auth"

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