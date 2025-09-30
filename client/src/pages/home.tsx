import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { ProblemSection } from "@/components/problem-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { BenefitsSection } from "@/components/benefits-section";
import { OpenBankingSection } from "@/components/open-banking-section";
import { WaitlistForm } from "@/components/waitlist-form";
import { FAQSection } from "@/components/faq-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <HowItWorksSection />
      <BenefitsSection />
      <OpenBankingSection />
      
      <section id="waitlist" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">Early Access</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Join the Waiting List
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be among the first UK families to experience Envis. Limited spots available for our beta programme.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
