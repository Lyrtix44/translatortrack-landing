"use client"
import { useState } from "react"

const faqs = [
  {
    q: "Is this only for translators, or can other freelancers use it?",
    a: "TranslatorTrack is built specifically for freelance translators. The pricing model (per-word rates × word count × language pair) is translation-native and won't make sense for other freelance disciplines. If you're a translator, it will feel like it was built for you — because it was.",
  },
  {
    q: "What if I charge by the hour, not by the word?",
    a: "The Pro plan supports both per-word and per-hour billing. You can mix billing types across different clients and projects in the same account.",
  },
  {
    q: "Can I import my existing projects from a spreadsheet?",
    a: "Yes — CSV import is on the roadmap for the Pro plan. In the meantime, entering your active projects manually takes about 2 minutes per project and you only need to do it once.",
  },
  {
    q: "Does this replace memoQ or Trados?",
    a: "No, and it's not trying to. CAT tools handle translation memory, term bases, and file processing. TranslatorTrack handles the business side: project tracking, invoicing, and getting paid. They work alongside each other.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your projects, client data, and invoices as CSV and PDF at any time. Your data is yours. If you cancel, you have 30 days to export everything before the account closes.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-paper py-24 px-6" id="faq">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Questions translators ask us
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-paper-dark transition-colors"
              >
                <span className="text-ink font-medium text-sm pr-4">{faq.q}</span>
                <span className="text-amber font-bold text-lg shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 border-t border-border">
                  <p className="text-slate-mid text-sm leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}