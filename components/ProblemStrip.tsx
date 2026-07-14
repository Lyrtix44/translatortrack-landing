const problems = [
  {
    emoji: "🧮",
    stat: "5–15 min",
    label: "per invoice",
    description:
      "Multiplied by 20–30 projects a month, you're spending half a workday doing arithmetic instead of translating.",
  },
  {
    emoji: "📊",
    stat: "0 tools",
    label: "built for translators",
    description:
      'memoQ and Trados cost $500+ and are built for agencies. Wave and FreshBooks don\'t know what a "per-word rate" is.',
  },
  {
    emoji: "💸",
    stat: "30+ days",
    label: "average payment wait",
    description:
      "Late invoices mean late payments. Without clear project tracking, follow-ups are easy to miss.",
  },
]

export function ProblemStrip() {
  return (
    <section className="bg-ink py-16 px-6">
      <div className="max-w-6xl mx-auto">

        <p className="text-amber text-sm font-semibold uppercase tracking-widest text-center mb-10">
          The problem every freelance translator knows
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div key={p.label} className="text-center">
              <div className="text-3xl mb-4">{p.emoji}</div>
              <div className="mb-1">
                <span className="text-amber font-display text-4xl">{p.stat}</span>
                <span className="text-white/60 text-sm ml-2">{p.label}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}