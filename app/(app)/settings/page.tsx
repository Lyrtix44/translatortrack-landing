// app/(app)/settings/page.tsx
import Link from "next/link"
import { User, Palette, CreditCard, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const SECTIONS = [
  { href: "/settings/account", icon: User, title: "Account Settings", desc: "Your name, email, and default rates." },
  { href: "/settings/branding", icon: Palette, title: "Invoice Branding", desc: "How your invoices look to clients." },
  { href: "/settings/billing", icon: CreditCard, title: "Billing & Plan", desc: "Your subscription and payment method." },
]

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Settings</h1>
      <div className="space-y-2 max-w-xl">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card hoverable className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-paper-dark flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-ink" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink font-medium text-sm">{s.title}</p>
                <p className="text-slate-mid text-xs">{s.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-mid/50 shrink-0" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}