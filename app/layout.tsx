// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "TranslatorTrack",
  description: "Project and invoice management built for freelance translators.",
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap",
    },
  ],
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