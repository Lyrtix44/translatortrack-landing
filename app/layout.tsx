import type { Metadata } from "next"
import "./globals.css"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "TranslatorTrack — Project & Invoice Manager for Freelance Translators",
  description:
    "Track projects by word count, auto-calculate invoices, and get paid faster. Built exclusively for freelance translators. No spreadsheet required.",
  openGraph: {
    title: "TranslatorTrack — Built for Freelance Translators",
    description:
      "Stop manually calculating per-word invoices. TranslatorTrack does the math, tracks your projects, and sends professional invoices in one click.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}