import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, PiggyBank, Users, CheckCircle, Lock, Network, BrainCircuit, Signpost, Zap, Target, MessageCircle, Link2, UserPlus, Play, Building, EyeOff, ShieldCheck } from "lucide-react";
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

  const features = [
    {
      icon: Zap,
      title: "Proactive AI That Works for You",
      description: "Envis doesn't just show you charts of past spending. It acts on your behalf—sweeping surplus cash to savings, preventing overdrafts, and alerting you to issues before they happen."
    },
    {
      icon: Target,
      title: "One Family, One Financial Plan",
      description: "Connect all your accounts—personal, joint, and credit cards—into a single, dynamic plan. See how every transaction impacts your shared goals, like saving for a house or a dream holiday, in real-time."
    },
    {
      icon: MessageCircle,
      title: "Financial Guidance That Speaks Your Language",
      description: "Forget spreadsheets. Just ask questions in plain English. \"How much can we spend on groceries this month?\" or \"Are we on track for the nursery fees?\" Get clear, simple answers instantly."
    }
  ];

  const trustPoints = [
    {
      icon: Lock,
      title: "Bank-Level Encryption"
    },
    {
      icon: Building,
      title: "FCA-Aligned Principles"
    },
    {
      icon: EyeOff,
      title: "Read-Only Access"
    },
    {
      icon: ShieldCheck,
      title: "GDPR Compliant"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Finally, a Financial Partner That Manages Your Family's Money for You.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Envis is the AI-powered coach that proactively coordinates your goals, prevents financial stress, and builds collective wealth. So you can focus on what matters most.
                </p>
              </div>

              <Button
                size="lg"
                onClick={scrollToWaitlist}
                className="text-base gap-2"
                data-testid="button-join-waitlist-hero"
              >
                Request Early Access
                <ArrowRight className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>FCA-compliant • Bank-level security • Your data stays private</span>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={heroImage}
                  alt="UK family managing finances together"
                  className="w-full h-full object-cover"
                  data-testid="img-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Family finances are complicated. Your bank app isn't helping.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4" data-testid="problem-coordination">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Network className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Coordination Chaos</h3>
              <p className="text-muted-foreground">
                Juggling personal accounts, a joint account, and credit cards feels like a full-time job. It's impossible to see the complete picture.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="problem-worry">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Constant Worry</h3>
              <p className="text-muted-foreground">
                Are we saving enough? Did that bill get paid on time? The mental load of managing it all is exhausting and creates friction.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="problem-advice">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Signpost className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">The Advice Gap</h3>
              <p className="text-muted-foreground">
                Professional financial advice is expensive and inaccessible. Who can you ask for simple, trustworthy guidance for your family's future?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution / Core Features Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Introducing Envis. Your Family's Financial Brain.
            </h2>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid gap-12 lg:grid-cols-2 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                data-testid={`feature-${index}`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-12 min-h-[300px] flex items-center justify-center">
                    <feature.icon className="h-32 w-32 text-primary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center space-y-4" data-testid="step-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold">Securely Connect Your Accounts</h3>
              <p className="text-muted-foreground">
                Using Open Banking technology, link your accounts in seconds with bank-level security.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="step-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold">Define Your Family's Goals</h3>
              <p className="text-muted-foreground">
                Tell Envis what you're saving for, from a new car to your children's future.
              </p>
            </div>

            <div className="text-center space-y-4" data-testid="step-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold">Let Envis Handle the Rest</h3>
              <p className="text-muted-foreground">
                Our AI gets to work, providing insights and automating tasks to help you reach your goals faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Data Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built to Reduce Stress and Save Money.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center space-y-4" data-testid="stat-stress">
              <div className="text-6xl md:text-7xl font-bold text-primary mb-2">85%</div>
              <p className="text-lg font-medium">Reduction in Financial Stress</p>
            </div>

            <div className="text-center space-y-4" data-testid="stat-fees">
              <div className="text-6xl md:text-7xl font-bold text-primary mb-2">92%</div>
              <p className="text-lg font-medium">Avoidance of Late Fees</p>
            </div>

            <div className="text-center space-y-4" data-testid="stat-savings">
              <div className="text-6xl md:text-7xl font-bold text-primary mb-2">22%</div>
              <p className="text-lg font-medium">Increase in Monthly Savings</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Based on pilot program user data.
          </p>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Security is Our Priority.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="text-center space-y-4"
                data-testid={`trust-point-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <point.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA / Waitlist Section */}
      <section id="waitlist" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to Outsmart Money, Together?
            </h2>
            <p className="text-lg text-muted-foreground">
              Be the first to experience the future of family finance. Join the waitlist for exclusive early access to Envis.
            </p>
          </div>

          <Card className="p-8 md:p-12">
            <WaitlistForm />
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
