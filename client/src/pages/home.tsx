import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, PiggyBank, Users, CheckCircle, Lock, Scale, BarChart3, Compass, MessageCircle, Building, ShieldCheck, Wallet, TrendingUp, Sparkles } from "lucide-react";
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

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const modules = [
    {
      icon: Wallet,
      title: "Intelligent Accounting",
      subtitle: "\"Mine, Yours, Ours.\"",
      description: "Automatically structures money to ensure transparency while respecting individual autonomy. See the complete picture without losing your independence."
    },
    {
      icon: Scale,
      title: "The Fairness Engine",
      subtitle: "\"Value Invisible Labour.\"",
      description: "A proprietary system that recognises non-monetary contributions like childcare and housework to calculate a truly fair contribution split."
    },
    {
      icon: BarChart3,
      title: "Blame-Free Progress Tracking",
      subtitle: "\"Focus on Progress, Not Guilt.\"",
      description: "Real-time, objective goal monitoring that removes the 'blame game' from missed targets. Track progress together without finger-pointing."
    },
    {
      icon: Compass,
      title: "Values Mediation",
      subtitle: "\"Honour Your Differences.\"",
      description: "Psychological modelling that helps Savers and Spenders find a middle ground without conflict. Your differences become strengths."
    },
    {
      icon: MessageCircle,
      title: "Proactive Coaching",
      subtitle: "\"Stop Fights Before They Start.\"",
      description: "Intelligent coaching that detects conflict triggers and intervenes with neutral, de-escalating guidance. Prevention over cure."
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
      icon: Shield,
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
                  The first platform that manages the emotional and practical complexities of couple finance. Stop arguing about money and start building your future.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={scrollToWaitlist}
                  className="text-base gap-2"
                  data-testid="button-join-waitlist-hero"
                >
                  Join the Waiting List
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToHowItWorks}
                  className="text-base gap-2"
                  data-testid="button-see-how-it-works"
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>FCA-aligned principles • Bank-level security • Your data stays private</span>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="relative h-[500px] lg:h-[550px]" data-testid="hero-graphic">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 overflow-hidden opacity-40">
                  <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>
                </div>

                {/* Modern vector connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Horizontal connections */}
                  <line x1="25%" y1="35%" x2="75%" y2="35%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 8">
                    <animate attributeName="stroke-dashoffset" from="0" to="16" dur="20s" repeatCount="indefinite" />
                  </line>
                  <line x1="25%" y1="65%" x2="75%" y2="65%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 8">
                    <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="20s" repeatCount="indefinite" />
                  </line>
                  {/* Vertical connections */}
                  <line x1="25%" y1="35%" x2="25%" y2="65%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 8">
                    <animate attributeName="stroke-dashoffset" from="0" to="16" dur="15s" repeatCount="indefinite" />
                  </line>
                  <line x1="75%" y1="35%" x2="75%" y2="65%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 8">
                    <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="15s" repeatCount="indefinite" />
                  </line>
                </svg>

                {/* Modern feature cards grid - all 5 modules */}
                <div className="relative h-full flex items-center justify-center px-4" style={{ zIndex: 2 }}>
                  <div className="w-full max-w-xl space-y-4">
                    {/* Top row - 3 cards */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Intelligent Accounting */}
                      <Card className="group p-5 hover-elevate active-elevate-2 transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '100ms', animationDuration: '700ms' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10">
                            <Wallet className="h-6 w-6 text-primary" strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-center leading-tight">Mine, Yours, Ours</span>
                        </div>
                      </Card>

                      {/* Fairness Engine */}
                      <Card className="group p-5 hover-elevate active-elevate-2 transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '200ms', animationDuration: '700ms' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10">
                            <Scale className="h-6 w-6 text-primary" strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-center leading-tight">Fairness Engine</span>
                        </div>
                      </Card>

                      {/* Blame-Free Tracking */}
                      <Card className="group p-5 hover-elevate active-elevate-2 transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '300ms', animationDuration: '700ms' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10">
                            <BarChart3 className="h-6 w-6 text-primary" strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-center leading-tight">Progress Tracking</span>
                        </div>
                      </Card>
                    </div>

                    {/* Bottom row - 2 cards centered */}
                    <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                      {/* Values Mediation */}
                      <Card className="group p-5 hover-elevate active-elevate-2 transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '400ms', animationDuration: '700ms' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10">
                            <Compass className="h-6 w-6 text-primary" strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-center leading-tight">Values Mediation</span>
                        </div>
                      </Card>

                      {/* Proactive Coaching */}
                      <Card className="group p-5 hover-elevate active-elevate-2 transition-all duration-500 bg-card/95 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: '500ms', animationDuration: '700ms' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/10">
                            <MessageCircle className="h-6 w-6 text-primary" strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-center leading-tight">Proactive Coaching</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - The Crisis */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why managing money together feels so hard.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <Card className="p-8 text-center space-y-4 bg-card/80" data-testid="problem-shame">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">72%</div>
              <p className="text-lg text-muted-foreground">
                of couples experience shame or discomfort discussing money.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 bg-card/80" data-testid="problem-stress">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">52%</div>
              <p className="text-lg text-muted-foreground">
                report financial stress damages their relationship.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 bg-card/80" data-testid="problem-products">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">7-10</div>
              <p className="text-lg text-muted-foreground">
                different financial products couples juggle without a full-picture view.
              </p>
            </Card>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <p className="text-lg font-medium">
                <span className="text-primary font-semibold">The key insight:</span> Existing apps treat family finance as "individual finance times two." We treat you as a partnership.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution / Core Modules Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Five Proprietary Modules
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for couples, designed to eliminate financial conflict and invisible labour.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <Card
                key={index}
                className="group p-8 hover-elevate transition-all duration-300 border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                data-testid={`module-${index}`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110">
                    <module.icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{module.title}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{module.subtitle}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Validation Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Backed by Science & Research
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12 text-center space-y-6 bg-card">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Our system is grounded in <span className="text-foreground font-medium">peer-reviewed behavioural science</span> and validated by primary research with <span className="text-foreground font-medium">100+ UK families</span>. We're building on decades of relationship psychology research to create something genuinely new.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Security is Our Priority
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
              Ready to Transform Your Relationship with Money?
            </h2>
            <p className="text-lg text-muted-foreground">
              Be among the first to experience the future of couple finance. Join the waiting list for exclusive early access to Envis.
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
