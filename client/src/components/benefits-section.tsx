import { Shield, Heart, PiggyBank, Users, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Heart,
      title: "Reduce Financial Stress",
      description: "Stop worrying about money. Our AI coach helps you stay on top of your finances effortlessly."
    },
    {
      icon: Clock,
      title: "Avoid Late Fees",
      description: "Never miss a payment again with proactive reminders and automated tracking."
    },
    {
      icon: PiggyBank,
      title: "Save More Together",
      description: "Identify savings opportunities and reach your family goals faster with intelligent insights."
    },
    {
      icon: Users,
      title: "Whole Family View",
      description: "See your complete financial picture in one place—all accounts, all family members."
    },
    {
      icon: TrendingUp,
      title: "Smart Financial Planning",
      description: "Get personalised recommendations based on your family's unique situation and goals."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with military-grade encryption and FCA-compliant security."
    }
  ];

  return (
    <section id="benefits" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-sm font-medium text-primary mb-2">Benefits</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Transform Your Family's Financial Future
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to take control of your finances and achieve your goals together.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate"
              data-testid={`benefit-card-${index}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success mb-4">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
