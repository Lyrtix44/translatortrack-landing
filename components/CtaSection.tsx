import { EmailCapture } from "./EmailCapture"

export function CtaSection() {
  return (
    <section className="bg-ink py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">

        <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-4">
          Join the waitlist
        </p>

        <h2 className="font-display text-3xl md:text-5xl text-white mb-6 leading-tight">
          Your next invoice should take{" "}
          <span className="font-display-italic text-amber">3 seconds</span>,
          not 15 minutes.
        </h2>

        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          TranslatorTrack is in early access. Join the waitlist and be 
          first to use it — with 3 months free for beta testers.
        </p>

        <div className="flex justify-center">
          <EmailCapture
            placeholder="your@email.com"
            buttonText="Reserve my spot →"
            source="cta-bottom"
          />
        </div>

        <p className="text-white/40 text-xs mt-4">
          Free plan available forever. Beta testers get 3 months of Pro free.
        </p>

      </div>
    </section>
  )
}