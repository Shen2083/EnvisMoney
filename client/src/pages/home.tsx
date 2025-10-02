import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, PiggyBank, Users, CheckCircle, Lock, Network, BrainCircuit, Signpost, Zap, Target, MessageCircle, Link2, UserPlus, Play, Building, EyeOff, ShieldCheck, Wallet, TrendingUp, CreditCard } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

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
      title: "Proactive Insights and Smart Actions",
      description: "Envis doesn't just show you charts of past spending. It provides intelligent recommendations—identifying surplus cash for savings, preventing overdrafts, and alerting you to issues before they happen. You control which actions to enable: read-only insights or optional automated transfers with your explicit permission."
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
                  Your Family's Financial Partner, Finally.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Envis is the intelligent financial coach that proactively coordinates your goals, prevents financial stress, and builds collective wealth. So you can focus on what matters most.
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
                <span>FCA-aligned principles • Bank-level security • Your data stays private</span>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative h-[400px] lg:h-[500px]" data-testid="hero-graphic">
                {/* Modern gradient background */}
                <div className="absolute inset-0 overflow-hidden opacity-60">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Connecting lines - more elegant */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <line x1="30%" y1="30%" x2="70%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <line x1="30%" y1="70%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <line x1="30%" y1="30%" x2="30%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <line x1="70%" y1="30%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" />
                  <line x1="30%" y1="30%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <line x1="70%" y1="30%" x2="30%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                </svg>

                {/* Modern floating icon cards */}
                <div className="relative h-full flex items-center justify-center" style={{ zIndex: 2 }}>
                  <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                    {/* Top left - Accounts */}
                    <Card className="group p-6 hover-elevate transition-all duration-300 backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '0ms', animationDuration: '600ms' }}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                          <Wallet className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-center">Connected Accounts</span>
                      </div>
                    </Card>

                    {/* Top right - Savings */}
                    <Card className="group p-6 hover-elevate transition-all duration-300 backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 mt-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '150ms', animationDuration: '600ms' }}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                          <PiggyBank className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-center">Smart Savings</span>
                      </div>
                    </Card>

                    {/* Bottom left - Goals */}
                    <Card className="group p-6 hover-elevate transition-all duration-300 backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms', animationDuration: '600ms' }}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                          <Target className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-center">Family Goals</span>
                      </div>
                    </Card>

                    {/* Bottom right - Growth */}
                    <Card className="group p-6 hover-elevate transition-all duration-300 backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 mt-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '450ms', animationDuration: '600ms' }}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                          <TrendingUp className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-center">Smart Insights</span>
                      </div>
                    </Card>
                  </div>
                </div>
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
                Envis gets to work, providing insights and smart recommendations to help you reach your goals faster.
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

      {/* FAQ Section */}
      <FAQSection />

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
