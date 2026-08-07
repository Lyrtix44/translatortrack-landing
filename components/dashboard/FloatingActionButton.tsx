// components/dashboard/FloatingActionButton.tsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { Plus, Languages, Receipt, UserPlus } from "lucide-react"

const ACTIONS = [
  { label: "Add Client", icon: UserPlus, href: "/clients" },
  { label: "Generate Invoice", icon: Receipt, href: "/invoices/new" },
  { label: "New Project", icon: Languages, href: "/projects/new" },
]

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {isOpen &&
        ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 bg-white shadow-dropdown rounded-full pl-4 pr-1.5 py-1.5 border border-border hover:border-ink/20 transition-colors"
          >
            <span className="text-sm font-medium text-ink whitespace-nowrap">{action.label}</span>
            <span className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-white shrink-0">
              <action.icon size={16} />
            </span>
          </Link>
        ))}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-amber hover:bg-amber-hover text-ink shadow-dropdown flex items-center justify-center transition-transform duration-200"
        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
        aria-expanded={isOpen}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  )
}