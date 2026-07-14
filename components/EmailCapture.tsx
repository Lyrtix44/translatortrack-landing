"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function EmailCapture({
  placeholder = "your@email.com",
  buttonText = "Join the waitlist →",
  source = "hero",
}: {
  placeholder?: string
  buttonText?: string
  source?: string
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit() {
    if (!email || !email.includes("@")) return
    setStatus("loading")

    try {
      const res = await fetch("https://formspree.io/f/xkodngnn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      })
      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="bg-amber-50 border border-amber/30 rounded-xl px-6 py-4 text-center">
        <p className="text-ink font-semibold">✓ You&apos;re on the list.</p>
        <p className="text-slate-mid text-sm mt-1">
          I&apos;ll email you personally when early access opens. Thank you.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 bg-white border border-border text-ink placeholder-slate-mid/60 px-4 py-3 rounded-lg focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 transition-all text-sm"
      />
      <Button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="bg-ink hover:bg-ink-light disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-sm"
      >
        {status === "loading" ? "Joining..." : buttonText}
      </Button>
    </div>
  )
}