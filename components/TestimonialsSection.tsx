const testimonials = [
  {
    quote:
      "I've been using a spreadsheet for 6 years. Every month I spend Sunday morning manually calculating 20+ invoices. If this does what it says, I'll switch on day one.",
    name: "Maria S.",
    role: "EN→ES Translator, Madrid",
    initials: "MS",
  },
  {
    quote:
      "The problem isn't that the math is hard. It's that I do it wrong when I'm tired, and then I undercharge a client and don't notice for two weeks.",
    name: "Thomas K.",
    role: "EN→DE Translator, Berlin",
    initials: "TK",
  },
  {
    quote:
      "I tried Toggl, I tried FreshBooks, I tried Monday.com. None of them know what a source word count is. I end up maintaining three different tools and a spreadsheet anyway.",
    name: "Aiko N.",
    role: "EN→JA Translator, Tokyo",
    initials: "AN",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-paper-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">
            From the community
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Translators told us this, word for word
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-border rounded-2xl p-6">
              <p className="text-ink/80 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink/10 flex items-center justify-center">
                  <span className="text-ink text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-ink text-sm font-semibold">{t.name}</p>
                  <p className="text-slate-mid text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}