import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, PiggyBank, Users, CheckCircle, Lock } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";
import { Footer } from "@/components/footer";
import heroImage from "@assets/generated_images/UK_family_using_tablet_together_f0a9567d.png";

export default function Home() {
  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const benefits = [
    {
      icon: Heart,
      title: "85% Reduction",
      subtitle: "in Financial Stress",
      description: "Stop worrying about money. Our AI keeps you on track."
    },
    {
      icon: Shield,
      title: "92% Success Rate",
      subtitle: "Avoiding Late Fees",
      description: "Never miss a payment with proactive alerts."
    },
    {
      icon: PiggyBank,
      title: "Smart Savings",
      subtitle: "Opportunities",
      description: "AI identifies ways to save money across all accounts."
    },
    {
      icon: Users,
      title: "Whole Family",
      subtitle: "Financial View",
      description: "See everything in one place, manage together."
    }
  ];

  const trustPoints = [
    "FCA-regulated Open Banking technology",
    "Bank-level encryption & security",
    "Read-only access—we can never move your money",
    "You control your data, revoke access anytime"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  Your Family's
                  <span className="block text-primary">Financial Future,</span>
                  <span className="block">Simplified</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Envis is the AI-powered financial coach helping UK families reduce stress, avoid late fees, and achieve their goals together through intelligent Open Banking technology.
                </p>
              </div>

              <Button
                size="lg"
                onClick={scrollToWaitlist}
                className="text-base gap-2"
                data-testid="button-join-waitlist-hero"
              >
                Join the Waiting List
                <ArrowRight className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>FCA-compliant • Bank-level security • Your data stays private</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="UK family managing finances together"
                  className="w-full h-auto"
                  data-testid="img-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Proven Results for UK Families
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on pilot studies with real families facing the cost-of-living crisis
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-8 text-center hover-elevate"
                data-testid={`benefit-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{benefit.title}</div>
                <div className="text-sm font-medium text-primary mb-3">{benefit.subtitle}</div>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Be First to Experience Envis
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the waiting list for exclusive early access. Limited spots available for our Q2 2025 beta programme.
            </p>
          </div>

          <Card className="p-8 md:p-12">
            <WaitlistForm />
          </Card>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Built on Trust & Security
            </h2>
            <p className="text-lg text-muted-foreground">
              Powered by Open Banking—trusted by 15+ million UK adults
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4"
                data-testid={`trust-point-${index}`}
              >
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Family's Finances Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Don't wait. Join hundreds of UK families already on the list.
          </p>
          <Button
            size="lg"
            onClick={scrollToWaitlist}
            className="text-base gap-2"
            data-testid="button-join-waitlist-cta"
          >
            Join the Waiting List
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
