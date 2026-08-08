import { HeroSection } from "@/components/HeroSection"
import { ProblemStrip } from "@/components/ProblemStrip"
import { HowItWorksSection } from "@/components/HowItWorksSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { PricingSection } from "@/components/PricingSection"
import { TestimonialsSection } from "@/components/TestimonialsSection"
import { FAQSection } from "@/components/FAQSection"
import { CtaSection } from "@/components/CtaSection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemStrip />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CtaSection />
    </>
  )
}


