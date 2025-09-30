import { Bot, Link2, Sparkles, Bell } from "lucide-react";
import aiCoachImage from "@assets/generated_images/AI_financial_coach_illustration_cabc6fdb.png";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Link2,
      title: "Connect Securely",
      description: "Link your family's bank accounts using Open Banking—100% secure and FCA-regulated."
    },
    {
      icon: Bot,
      title: "AI Analysis",
      description: "Our intelligent coach analyses your spending patterns, income, and financial goals."
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "Receive personalised advice to save money, avoid fees, and reach your family goals."
    },
    {
      icon: Bell,
      title: "Proactive Alerts",
      description: "Get timely notifications before bills are due and when savings opportunities arise."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <img
              src={aiCoachImage}
              alt="AI Financial Coach"
              className="w-full h-auto rounded-2xl"
              data-testid="img-how-it-works"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <p className="text-sm font-medium text-primary mb-2">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Your Personal AI Financial Coach
              </h2>
              <p className="text-lg text-muted-foreground">
                Envis uses advanced AI to understand your family's unique financial situation and provide actionable guidance.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`step-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
