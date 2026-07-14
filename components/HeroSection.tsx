import { EmailCapture } from "./EmailCapture"
import { InvoiceCalculator } from "./InvoiceCalculator"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 bg-paper">
      <div className="max-w-6xl mx-auto">

        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-ink text-sm font-medium">
              Built exclusively for freelance translators
            </span>
          </div>
        </div>

        {/* Two-column layout: headline left, calculator right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl text-ink leading-tight mb-6">
              Stop calculating{" "}
              <span className="font-display-italic text-amber">
                every invoice
              </span>{" "}
              by hand.
            </h1>

            <p className="text-slate-mid text-lg leading-relaxed mb-8 max-w-lg">
              TranslatorTrack is the only project management tool that 
              understands word counts, per-word rates, and language pairs.
              Enter your project details — your invoice calculates itself.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div>
                <p className="text-2xl font-bold text-ink">640K+</p>
                <p className="text-sm text-slate-mid">freelance translators</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-ink">8 min</p>
                <p className="text-sm text-slate-mid">saved per invoice</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-ink">$0</p>
                <p className="text-sm text-slate-mid">to get started</p>
              </div>
            </div>

            {/* Email capture */}
            <EmailCapture
              placeholder="your@email.com"
              buttonText="Get early access →"
              source="hero"
            />

            <p className="text-xs text-slate-mid mt-3">
              Free plan available. No credit card required. 
              Join <span className="text-ink font-semibold">247 translators</span> on the waitlist.
            </p>
          </div>

          {/* Right column — live calculator */}
          <div className="flex justify-center lg:justify-end">
            <InvoiceCalculator />
          </div>

        </div>
      </div>
    </section>
  )
}