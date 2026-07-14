const features = [
  {
    icon: "🔢",
    title: "Word-count native",
    description:
      "Every project is built around words, not hours. Enter source word count and your per-word rate — the invoice total is instant. Supports different rates by language pair and client.",
  },
  {
    icon: "📋",
    title: "Project status board",
    description:
      "See every active project at a glance: In Progress, Delivered, Payment Pending, Paid. One screen replaces the three colour-coded spreadsheet tabs you're currently maintaining.",
  },
  {
    icon: "📄",
    title: "One-click PDF invoices",
    description:
      "Generate a professionally formatted invoice with your details, the project breakdown, and payment terms. No template editing. No copy-paste. Download or send directly.",
  },
  {
    icon: "📊",
    title: "Revenue dashboard",
    description:
      "Monthly words translated. Revenue by client. Outstanding payments. Upcoming deadlines. Everything a freelance translator actually needs to track — nothing they don't.",
  },
  {
    icon: "⏰",
    title: "Deadline tracking",
    description:
      "See which projects are due this week, which are overdue, and which are on track. No more scanning a spreadsheet by date. Colour-coded urgency, at a glance.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-paper-dark py-24 px-6" id="features">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            Everything a freelance translator needs.
            <span className="font-display-italic"> Nothing more.</span>
          </h2>
          <p className="text-slate-mid text-lg max-w-2xl mx-auto">
            We didn&apos;t build this for translation agencies. We didn&apos;t 
            build it for project managers. We built it for the 640,000 professional 
            translators working solo, one project at a time.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white border border-border rounded-2xl p-6 hover:border-ink/20 hover:shadow-sm transition-all ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-ink text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-mid text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Coming soon chips */}
        <div className="mt-10 text-center">
          <p className="text-slate-mid text-sm mb-4">On the roadmap</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["CAT tool integration", "Glossary manager", "Client portal", "Multi-currency", "Tax reporting"].map(
              (item) => (
                <span
                  key={item}
                  className="bg-white border border-border text-slate-mid text-xs px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

      </div>
    </section>
  )
}