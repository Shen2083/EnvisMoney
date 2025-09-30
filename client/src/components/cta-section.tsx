import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Transform Your Family's Finances?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of UK families on the waiting list. Be among the first to experience stress-free financial management.
        </p>
        <Button
          size="lg"
          onClick={scrollToWaitlist}
          className="text-base gap-2"
          data-testid="button-join-waitlist-cta"
        >
          Join the Waiting List Now
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground mt-6">
          Limited spots available for our beta programme
        </p>
      </div>
    </section>
  );
}
