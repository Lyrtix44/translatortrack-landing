import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "For translators just getting started.",
    features: [
      "Up to 5 active projects",
      "Invoice calculation",
      "PDF invoice download",
      "Basic dashboard",
    ],
    cta: "Start for free",
    isPopular: false,
  },
  {
    name: "Pro",
    price: 19,
    description: "For active freelancers juggling multiple clients.",
    features: [
      "Unlimited projects",
      "Unlimited PDF invoices",
      "Revenue dashboard",
      "Deadline tracking",
      "Client rate library",
      "Overdue invoice reminders",
      "Priority support",
    ],
    cta: "Start Pro — $19/mo",
    isPopular: true,
  },
  {
    name: "Studio",
    price: 49,
    description: "For translators managing a small team or agency.",
    features: [
      "Everything in Pro",
      "Up to 3 team members",
      "Shared client database",
      "Team workload view",
      "API access",
      "Custom invoice branding",
    ],
    cta: "Start Studio — $49/mo",
    isPopular: false,
  },
]

export function PricingSection() {
  return (
    <section className="bg-paper py-24 px-6" id="pricing">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            Priced for freelancers, not agencies
          </h2>
          <p className="text-slate-mid text-lg max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready. 
            At $19/month, TranslatorTrack pays for itself after saving 
            you 23 minutes of invoice work.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl border p-8 flex flex-col relative",
                plan.isPopular
                  ? "bg-ink border-ink shadow-xl shadow-ink/10"
                  : "bg-white border-border"
              )}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-amber text-ink text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3
                  className={cn(
                    "text-xl font-semibold mb-1",
                    plan.isPopular ? "text-white" : "text-ink"
                  )}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={cn(
                      "text-4xl font-display",
                      plan.isPopular ? "text-white" : "text-ink"
                    )}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.isPopular ? "text-white/50" : "text-slate-mid"
                    )}
                  >
                    /month
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    plan.isPopular ? "text-white/60" : "text-slate-mid"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-amber text-sm mt-0.5 shrink-0">✓</span>
                    <span
                      className={cn(
                        "text-sm",
                        plan.isPopular ? "text-white/80" : "text-ink/70"
                      )}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/signup"
                className={cn(
                  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold w-full text-center",
                  plan.isPopular
                    ? "bg-amber hover:bg-amber-light text-ink"
                    : "bg-ink hover:bg-ink-light text-white"
                )}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-mid text-sm mt-8">
          All paid plans include a 14-day free trial. No credit card required to start.
        </p>

      </div>
    </section>
  )
}