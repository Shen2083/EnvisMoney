import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  metadata: { tier?: string; features?: string } | null;
  prices: Price[];
}

const planFeatures: Record<string, string[]> = {
  family: [
    "Mine, Yours, Ours categorisation",
    "Fairness Engine for equitable contributions",
    "Blame-Free Progress Tracking",
    "Secure Open Banking connection",
    "Monthly financial health reports",
  ],
  family_plus: [
    "Everything in Family plan",
    "Values Mediation for aligned priorities",
    "Proactive Coaching recommendations",
    "Advanced goal planning tools",
    "Priority support",
    "Early access to new features",
  ],
};

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default function PricingPage() {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products'],
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest('POST', '/api/checkout', { priceId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handlePreOrder = (priceId: string) => {
    checkoutMutation.mutate(priceId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.products?.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-8 gap-2" data-testid="link-back-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Pre-Order Coming Soon</h1>
            <p className="text-muted-foreground mb-8">
              Our subscription plans are being set up. Please check back shortly or join our waitlist.
            </p>
            <Link href="/#waitlist">
              <Button data-testid="button-join-waitlist">Join Waitlist</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedProducts = [...data.products].sort((a, b) => {
    const priceA = a.prices[0]?.unit_amount || 0;
    const priceB = b.prices[0]?.unit_amount || 0;
    return priceA - priceB;
  });

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
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-order now and be among the first to experience intelligent family financial coaching. 
            Early supporters get priority access when we launch.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {sortedProducts.map((product, index) => {
            const price = product.prices[0];
            const tier = product.metadata?.tier || (index === 0 ? 'family' : 'family_plus');
            const features = planFeatures[tier] || planFeatures.family;
            const isPopular = tier === 'family_plus';

            return (
              <Card 
                key={product.id} 
                className={`relative p-8 ${isPopular ? 'border-primary border-2 shadow-lg' : ''}`}
                data-testid={`card-plan-${tier}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  
                  {price && (
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        {formatPrice(price.unit_amount, price.currency)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  size="lg"
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => price && handlePreOrder(price.id)}
                  disabled={!price || checkoutMutation.isPending}
                  data-testid={`button-preorder-${tier}`}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Pre-Order Now'
                  )}
                </Button>
              </Card>
            );
          })}
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
