import { Shield, Lock, CheckCircle } from "lucide-react";
import openBankingImage from "@assets/generated_images/Open_Banking_connection_graphic_6ccf9714.png";

export function OpenBankingSection() {
  const features = [
    {
      icon: Shield,
      title: "FCA Regulated",
      description: "Open Banking is regulated by the Financial Conduct Authority, ensuring the highest standards."
    },
    {
      icon: Lock,
      title: "Your Data, Your Control",
      description: "You decide what data to share and can revoke access anytime. We never sell your information."
    },
    {
      icon: CheckCircle,
      title: "Read-Only Access",
      description: "We can only view your transactions—we can never move money or make changes to your accounts."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-primary mb-2">Open Banking Technology</p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Built on Secure, Trusted Technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Envis uses Open Banking, the same secure technology trusted by over 15 million UK adults to share their financial data safely.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4" data-testid={`open-banking-feature-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src={openBankingImage}
              alt="Open Banking secure connection"
              className="w-full h-auto rounded-2xl"
              data-testid="img-open-banking"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
