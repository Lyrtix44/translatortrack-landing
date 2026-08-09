// app/api/invoices/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { createClient } from "@/lib/supabase/server"
import { InvoicePDF } from "@/components/invoices/InvoicePDF"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch the invoice with client info
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .eq("id", id)
    .single()

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  // Fetch the user's profile for branding
  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, business_address, payment_instructions")
    .eq("id", user.id)
    .single()

  // Build the PDF
  const pdfStream = await renderToBuffer(
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

  return new NextResponse(pdfStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
    },
  })
}