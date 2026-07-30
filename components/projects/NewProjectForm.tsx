// components/projects/NewProjectForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProjectAction } from "@/app/actions/projects"

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

  // AI intake state
  const [briefText, setBriefText] = useState("")
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [aiNote, setAiNote] = useState<string | null>(null)

  // Manual form fields (populated by AI or typed manually)
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
      setParseError("Paste a bit more detail from the client's message.")
      return
    }
    setParsing(true)
    setParseError(null)
    setAiNote(null)

    try {
      const res = await fetch("/api/parse-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: briefText }),
      })
      const data = await res.json()

      if (!res.ok) {
        setParseError(data.error || "Couldn't parse that — try filling in manually below.")
        return
      }

      const result: ParsedProject = data.result

      // Pre-fill editable fields
      setTitle(result.title)
      setSourceLang(result.source_language)
      setTargetLang(result.target_language)
      if (result.word_count) setWordCount(String(result.word_count))
      if (result.rate_hint) setRate(String(result.rate_hint))
      if (result.deadline) setDeadline(result.deadline)
      if (result.confidence_notes && result.confidence_notes !== "None") {
        setAiNote(result.confidence_notes)
      }

      // Try exact matching client name guess to existing client
      if (result.client_name_guess) {
        const match = clients.find(
          (c) => c.name.toLowerCase() === result.client_name_guess?.toLowerCase()
        )
        if (match) setClientId(match.id)
      }
    } catch {
      setParseError("Something went wrong reaching the AI. Try filling in manually below.")
    } finally {
      setParsing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !title || !wordCount || !rate) return

    setSubmitting(true)
    const project = await createProjectAction({
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

    if (project) router.push("/dashboard")
  }

  const invoiceTotal =
    wordCount && rate ? (parseInt(wordCount) * parseFloat(rate)).toFixed(2) : null

  return (
    <div className="space-y-6">
      {/* AI Intake Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✨</span>
          <h3 className="font-semibold text-slate-900 text-sm">Paste a client message</h3>
        </div>
        <p className="text-slate-600 text-xs mb-3">
          Paste the email or message from your client — we&apos;ll pre-fill the form below.
        </p>
        <textarea
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
          placeholder='e.g. "Hi Maria, new contract for you — about 4500 words, EN to DE, need it by next Friday, usual rate."'
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-slate-800 bg-white resize-none"
        />
        {parseError && <p className="text-red-600 text-xs mt-2">{parseError}</p>}
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing}
          className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {parsing ? "Reading message..." : "Parse with AI →"}
        </button>
      </div>

      {aiNote && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          <strong>AI note:</strong> {aiNote} — please double-check the fields below.
        </div>
      )}

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Client
          </label>
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50"
          >
            <option value="">Select a client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Project title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Source language
            </label>
            <input
              required
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Target language
            </label>
            <input
              required
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Word count
            </label>
            <input
              required
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Rate per word
            </label>
            <input
              required
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        {invoiceTotal && (
          <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-600">Invoice total</span>
            <span className="text-xl font-bold text-slate-900">${invoiceTotal}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create project"}
        </button>
      </form>
    </div>
  )
}