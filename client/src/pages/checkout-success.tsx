import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4" data-testid="text-success-title">
          Thank You for Your Pre-Order!
        </h1>

        <p className="text-muted-foreground mb-6">
          You're now an early supporter of Envis. We'll notify you as soon as we launch 
          and your subscription begins. You'll have priority access to our family financial 
          coaching platform.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li>1. You'll receive a confirmation email shortly</li>
            <li>2. We'll keep you updated on our launch progress</li>
            <li>3. Your subscription activates when we go live</li>
            <li>4. Cancel anytime before launch for a full refund</li>
          </ul>
        </div>

        <Link href="/">
          <Button className="gap-2" data-testid="button-back-home">
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
