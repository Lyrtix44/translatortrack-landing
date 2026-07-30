// components/invoices/DraftReminderButton.tsx
"use client"

import { useState } from "react"

interface DraftReminderButtonProps {
  clientName: string
  invoiceNumber: string
  amount: string
  dueDate: string
  daysOverdue: number
}

export function DraftReminderButton({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  daysOverdue,
}: DraftReminderButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setDraft("")
    setIsOpen(true)

    try {
      const response = await fetch("/api/draft-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          invoiceNumber,
          amount,
          dueDate,
          daysOverdue,
        }),
      })

      if (!response.ok || !response.body) {
        setDraft("Failed to generate reminder email. Please try again.")
        setLoading(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setDraft((prev) => prev + text)
      }
    } catch {
      setDraft("An error occurred while streaming response.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
      >
        <span>✨</span> Draft Reminder
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <span>✨</span> AI Email Reminder Draft
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[160px] max-h-[300px] overflow-y-auto text-sm text-slate-800 whitespace-pre-wrap font-sans">
              {draft || (loading && <span className="animate-pulse text-slate-400">Generating email draft...</span>)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                disabled={!draft || loading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {copied ? "Copied! ✓" : "Copy to Clipboard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}