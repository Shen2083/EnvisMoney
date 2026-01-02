import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

const unifiedFeatures = [
  {
    title: "Unlimited Account Connections",
    description: "Connect personal, joint, and savings accounts for a full family view",
  },
  {
    title: "Intelligent \"Mine/Yours/Ours\" Sorting",
    description: "Automatically organise finances while maintaining individual privacy",
  },
  {
    title: "The Fairness Engine™",
    description: "Calculate fair contributions that value invisible labour (like childcare) alongside income",
  },
  {
    title: "Proactive AI Coaching",
    description: "Get neutral, real-time guidance to resolve conflicts before they start",
  },
  {
    title: "Blame-Free Progress Tracking",
    description: "Track shared goals (like house deposits) objectively without judgement",
  },
  {
    title: "Bank-Level Security",
    description: "Secure, read-only access via Open Banking with end-to-end encryption",
  },
];

const pricingPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 19.99,
    period: "/month",
    subtext: "Flexible, cancel anytime.",
    buttonText: "Start Monthly",
    isPopular: false,
    interval: "month",
  },
  {
    id: "annual",
    name: "Annual",
    price: 134.99,
    period: "/year",
    subtext: "Save 44% (Pay once a year).",
    buttonText: "Start Annual",
    isPopular: true,
    interval: "year",
  },
];

export default function PricingPage() {
  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('POST', '/api/checkout', { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handlePreOrder = (planId: string) => {
    checkoutMutation.mutate(planId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One complete solution for your family's finances. Choose the billing that works best for you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative p-8 ${plan.isPopular ? 'border-primary border-2 shadow-lg' : ''}`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                
                <div className="mb-2">
                  <span className="text-4xl font-bold">£{plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <p className="text-sm text-muted-foreground">{plan.subtext}</p>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                variant={plan.isPopular ? "default" : "outline"}
                onClick={() => handlePreOrder(plan.id)}
                disabled={checkoutMutation.isPending}
                data-testid={`button-preorder-${plan.id}`}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Everything Included</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {unifiedFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span>Secure payment powered by Stripe</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Your subscription starts when we launch. You can cancel anytime before launch for a full refund. 
            All payments are processed securely through Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
