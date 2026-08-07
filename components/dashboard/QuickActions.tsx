// components/dashboard/QuickActions.tsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { Receipt, UserPlus, Calculator, X, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

const LINK_ACTIONS = [
  { label: "New Project", icon: Plus, href: "/projects/new" },
  { label: "Generate Invoice", icon: Receipt, href: "/invoices/new" },
  { label: "Add Client", icon: UserPlus, href: "/clients" },
]

export function QuickActions() {
  const [countModalOpen, setCountModalOpen] = useState(false)

  return (
    <>
      <Card className="p-5">
        <p className="text-xs font-semibold text-slate-mid uppercase tracking-wider mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LINK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-ink/20 hover:bg-paper transition-colors text-center"
            >
              <action.icon size={20} className="text-ink" />
              <span className="text-xs font-medium text-ink">{action.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setCountModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-ink/20 hover:bg-paper transition-colors text-center"
          >
            <Calculator size={20} className="text-ink" />
            <span className="text-xs font-medium text-ink">Paste Text to Count</span>
          </button>
        </div>
      </Card>

      {countModalOpen && <PasteToCountModal onClose={() => setCountModalOpen(false)} />}
    </>
  )
}

function PasteToCountModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("")
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-dropdown max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-ink">Paste Text to Count</h3>
          <button onClick={onClose} className="text-slate-mid hover:text-ink transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste source text here — no need to save it anywhere first."
          rows={8}
          autoFocus
          className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:border-ink resize-none"
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-mid">Word count</p>
          <p className="font-display text-2xl text-ink">{wordCount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}