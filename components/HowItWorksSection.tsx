const steps = [
  {
    number: "01",
    title: "Create a project",
    description:
      "Enter your client name, language pair, word count, per-word rate, and deadline. Takes 30 seconds — less than filling in one cell of a spreadsheet.",
    detail: "Supports multiple language pairs per client. Rate library saves your common rates automatically.",
  },
  {
    number: "02",
    title: "Invoice calculates itself",
    description:
      "The moment you enter a word count and rate, your invoice total appears. No formulas. No calculator. No copy-paste errors. Done.",
    detail: "Handles flat-rate minimums, rush fees, and multi-document projects automatically.",
  },
  {
    number: "03",
    title: "Send it in one click",
    description:
      "Generate a professional PDF invoice with your client's details, project breakdown, and payment terms. Send it directly from TranslatorTrack.",
    detail: "Track payment status from Pending → Received. Get a reminder when an invoice goes overdue.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-paper py-24 px-6" id="how-it-works">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            From project to payment in three steps
          </h2>
          <p className="text-slate-mid text-lg max-w-2xl mx-auto">
            TranslatorTrack replaces your spreadsheet, your calculator, 
            and your invoicing tool — with one workflow built around how 
            you actually work.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col md:flex-row gap-8 items-start ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Step content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-display text-5xl text-amber/30 leading-none">
                    {step.number}
                  </span>
                  <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                </div>
                <p className="text-slate-mid text-base leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className="bg-paper-dark border border-border rounded-lg px-4 py-3">
                  <p className="text-sm text-ink/70 flex items-start gap-2">
                    <span className="text-amber font-bold mt-0.5">→</span>
                    {step.detail}
                  </p>
                </div>
              </div>

              {/* Step visual placeholder */}
              <div className="flex-1 bg-paper-dark border border-border rounded-xl h-48 flex items-center justify-center">
                <p className="text-slate-mid/40 text-sm font-mono">
                  [Step {step.number} screenshot]
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}