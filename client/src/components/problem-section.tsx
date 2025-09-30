import { AlertCircle, TrendingDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ProblemSection() {
  const problems = [
    {
      icon: TrendingDown,
      title: "Cost-of-Living Crisis",
      description: "Rising inflation and costs are putting unprecedented pressure on family budgets across the UK."
    },
    {
      icon: Clock,
      title: "The Advice Gap",
      description: "Only 9% of UK adults receive financial advice, leaving millions without guidance for their financial future."
    },
    {
      icon: AlertCircle,
      title: "Financial Stress",
      description: "Families struggle to manage expenses, track spending, and avoid late fees without the right tools."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            UK Families Face Real Financial Challenges
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional financial advice is expensive and inaccessible. Meanwhile, families need help now more than ever.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate"
              data-testid={`problem-card-${index}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 text-destructive mb-4">
                <problem.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
