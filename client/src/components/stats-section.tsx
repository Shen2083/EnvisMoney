import { Users, TrendingUp, Shield } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "15M+",
      label: "UK adults use Open Banking",
      description: "Join the financial revolution"
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Reduction in financial stress",
      description: "Proven results from pilot studies"
    },
    {
      icon: Shield,
      value: "92%",
      label: "Avoid late fees",
      description: "Never miss a payment again"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Trusted by UK Families</p>
          <h2 className="text-3xl md:text-4xl font-semibold">Join thousands taking control of their finances</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-3"
              data-testid={`stat-${index}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="font-mono text-4xl md:text-5xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-base font-medium text-foreground">
                {stat.label}
              </div>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
