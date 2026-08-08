// components/projects/NewProjectForm.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProjectAction } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Client {
  id: string
  name: string
  default_rate: number | null
  currency: string
}

interface ParsedProject {
  title: string
  source_language: string
  target_language: string
  word_count: number | null
  deadline: string | null
  rate_hint: number | null
  client_name_guess: string | null
  confidence_notes: string
}

export function NewProjectForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [briefText, setBriefText] = useState("")
  const [parsing, setParsing] = useState(false)
  const [aiNote, setAiNote] = useState<string | null>(null)

  const [clientId, setClientId] = useState("")
  const [title, setTitle] = useState("")
  const [sourceLang, setSourceLang] = useState("EN")
  const [targetLang, setTargetLang] = useState("")
  const [wordCount, setWordCount] = useState("")
  const [rate, setRate] = useState("")
  const [deadline, setDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleParse() {
    if (briefText.trim().length < 10) {
      toast.error("Paste a bit more detail from the client's message.")
      return
    }
    setParsing(true)
    setAiNote(null)
    try {
      const res = await fetch("/api/parse-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: briefText }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Couldn't parse that message.")
        return
      }
      const result: ParsedProject = data.result
      setTitle(result.title)
      setSourceLang(result.source_language)
      setTargetLang(result.target_language)
      if (result.word_count) setWordCount(String(result.word_count))
      if (result.rate_hint) setRate(String(result.rate_hint))
      if (result.deadline) setDeadline(result.deadline)
      if (result.confidence_notes && result.confidence_notes !== "None") setAiNote(result.confidence_notes)
      if (result.client_name_guess) {
        const match = clients.find((c) => c.name.toLowerCase() === result.client_name_guess?.toLowerCase())
        if (match) setClientId(match.id)
      }
      toast.success("Parsed — review the fields below.")
    } catch {
      toast.error("Something went wrong reaching the AI.")
    } finally {
      setParsing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !title || !wordCount || !rate) return
    setSubmitting(true)
    const { project, error } = await createProjectAction({
      client_id: clientId,
      title,
      source_language: sourceLang,
      target_language: targetLang,
      word_count: parseInt(wordCount),
      rate_per_word: parseFloat(rate),
      currency: clients.find((c) => c.id === clientId)?.currency || "USD",
      deadline: deadline ? new Date(deadline).toISOString() : null,
    })
    setSubmitting(false)
    if (error) {
      toast.error(error)
      return
    }
    if (project) router.push("/projects")
  }

  const invoiceTotal = wordCount && rate ? (parseInt(wordCount) * parseFloat(rate)).toFixed(2) : null

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="bg-amber-light border-amber/30 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✨</span>
          <h3 className="font-semibold text-ink text-sm">Paste a client message</h3>
        </div>
        <p className="text-slate-mid text-xs mb-3">
          Paste the email or message from your client — we'll pre-fill the form below.
        </p>
        <textarea
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
          placeholder='e.g. "Hi Maria, new contract — about 4500 words, EN to DE, due next Friday, usual rate."'
          rows={3}
          className="w-full border border-border rounded px-4 py-3 text-sm focus:outline-none focus:border-ink bg-white resize-none"
        />
        <Button type="button" onClick={handleParse} disabled={parsing} variant="secondary" size="sm" className="mt-3">
          {parsing ? "Reading message..." : "Parse with AI →"}
        </Button>
      </Card>

      {aiNote && (
        <div className="bg-info-light border border-info/20 rounded px-4 py-3 text-sm text-info">
          <strong>AI note:</strong> {aiNote} — please double-check the fields below.
        </div>
      )}

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
              <Input required value={sourceLang} onChange={(e) => setSourceLang(e.target.value.toUpperCase())} maxLength={2} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
                Target language
              </label>
              <Input required value={targetLang} onChange={(e) => setTargetLang(e.target.value.toUpperCase())} maxLength={2} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
                Word count
              </label>
              <Input required type="number" value={wordCount} onChange={(e) => setWordCount(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
                Rate per word
              </label>
              <Input required type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
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

          <Button type="submit" disabled={submitting} variant="primary" size="lg" className="w-full">
            {submitting ? "Creating..." : "Create project"}
          </Button>
        </form>
      </Card>
    </div>
  )
}