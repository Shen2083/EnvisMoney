import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/UK_family_using_tablet_together_f0a9567d.png";

export function HeroSection() {
  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
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
                The first AI financial partner built for couples. Move beyond the 50/50 split with a system that recognises invisible labour, mediates spending values, and stops money arguments before they start.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="text-base"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>

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
  );
}
