import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingShell } from "@/components/landing/landing-shell";
import { LeadForm } from "@/components/landing/lead-form";
import { ModulesSection } from "@/components/landing/modules-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";

export default function LandingPage() {
  return (
    <LandingShell>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ModulesSection />
      <PricingSection />
      <LeadForm />
      <FaqSection />
      <FinalCta />
    </LandingShell>
  );
}
