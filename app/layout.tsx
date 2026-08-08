// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "TranslatorTrack",
  description: "Project and invoice management built for freelance translators.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}