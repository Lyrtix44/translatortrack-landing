// components/projects/EditProjectForm.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateProjectAction } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Project } from "@/lib/db/projects"

interface Client {
  id: string
  name: string
  default_rate: number | null
  currency: string
}

interface EditProjectFormProps {
  project: Project
  clients: Client[]
}

export function EditProjectForm({ project, clients }: EditProjectFormProps) {
  const router = useRouter()
  const [clientId, setClientId] = useState(project.client_id)
  const [title, setTitle] = useState(project.title)
  const [sourceLang, setSourceLang] = useState(project.source_language)
  const [targetLang, setTargetLang] = useState(project.target_language)
  const [wordCount, setWordCount] = useState(String(project.word_count))
  const [rate, setRate] = useState(String(project.rate_per_word))
  const [deadline, setDeadline] = useState(project.deadline?.split("T")[0] || "")
  const [submitting, setSubmitting] = useState(false)

  const selectedClient = clients.find((c) => c.id === clientId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !title || !wordCount || !rate) return

    setSubmitting(true)
    const formData = new FormData()
    formData.append("client_id", clientId)
    formData.append("title", title)
    formData.append("source_language", sourceLang)
    formData.append("target_language", targetLang)
    formData.append("word_count", wordCount)
    formData.append("rate_per_word", rate)
    formData.append("currency", selectedClient?.currency || "USD")
    formData.append("deadline", deadline)

    const result = await updateProjectAction(project.id, formData)
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Project updated successfully.")
    router.push(`/projects/${project.id}`)
    router.refresh()
  }

  const invoiceTotal = wordCount && rate ? (parseInt(wordCount) * parseFloat(rate)).toFixed(2) : null

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Client
          </label>
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full border border-border rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
          >
            <option value="">Select a client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Project title
          </label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Source language
            </label>
            <Input
              required
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value.toUpperCase())}
              maxLength={2}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Target language
            </label>
            <Input
              required
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value.toUpperCase())}
              maxLength={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Word count
            </label>
            <Input
              required
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
              Rate per word
            </label>
            <Input
              required
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Deadline
          </label>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        {invoiceTotal && (
          <div className="bg-paper-dark rounded px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-mid">Invoice total</span>
            <span className="font-display text-xl text-ink">${invoiceTotal}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} variant="primary" size="lg" className="flex-1">
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  )
}