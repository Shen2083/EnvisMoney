import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import heroImage from "@assets/generated_images/UK_family_using_tablet_together_f0a9567d.png";

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (emailAddress: string) => {
      const res = await apiRequest("POST", "/api/waitlist", {
        name: "",
        email: emailAddress,
        familySize: "2",
        interests: "Signed up via hero section",
      });
      return await res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setError("");
    },
    onError: (err: any) => {
      const msg = err?.message || "Something went wrong. Please try again.";
      try {
        const match = msg.match(/\d+:\s*({.*})/);
        if (match) {
          const parsed = JSON.parse(match[1]);
          setError(parsed.error || msg);
        } else {
          setError(msg);
        }
      } catch {
        setError(msg);
      }
    },
  });

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    mutation.mutate(email);
  };

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

            {submitted ? (
              <div className="flex items-center gap-3 p-4 rounded-md bg-success/10 text-success" data-testid="hero-success-message">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">You're on the list! We'll be in touch soon.</span>
              </div>
            ) : (
              <form onSubmit={handleQuickSignup} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    data-testid="input-hero-email"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="gap-2 whitespace-nowrap"
                    disabled={mutation.isPending}
                    data-testid="button-hero-signup"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Request Early Access
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-destructive" data-testid="hero-error-message">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Join the waitlist for early access. No spam, unsubscribe anytime.
                </p>
              </form>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
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
              <span>FCA-aligned principles • Bank-level security • Your data stays private</span>
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
