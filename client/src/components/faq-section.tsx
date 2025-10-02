import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

export function FAQSection() {
  const faqs = [
    {
      question: "How does Envis keep my financial data secure?",
      answer: "Envis uses bank-level 256-bit encryption and read-only access through regulated Open Banking APIs. We never store your banking credentials, and all data is encrypted both in transit and at rest. We're also GDPR compliant and follow FCA-aligned principles to protect your privacy."
    },
    {
      question: "What is Open Banking and how does it work?",
      answer: "Open Banking is a secure, regulated system that lets you safely share your financial data with authorised providers like Envis. By default, we use read-only access, meaning we can see your transactions and balances but cannot move money. If you choose to enable features like automated transfers to savings, we'll ask for your explicit permission to use Payment Initiation Services (PIS). You're always in control."
    },
    {
      question: "How much does Envis cost?",
      answer: "We're currently in our early access phase and finalising our pricing structure. Join our waitlist to be among the first to know when we launch and receive exclusive early access pricing. We're committed to making Envis accessible and affordable for all UK families."
    },
    {
      question: "Which banks and accounts can I connect?",
      answer: "Envis works with all major UK banks and building societies that support Open Banking, including Barclays, HSBC, Lloyds, NatWest, Monzo, Starling, and many more. You can connect current accounts, savings accounts, credit cards, and joint accounts to get a complete picture of your family's finances."
    },
    {
      question: "How is Envis different from other budgeting apps?",
      answer: "Unlike traditional budgeting apps that just track spending, Envis is a proactive intelligent coach that provides actionable recommendations for your family. It identifies surplus cash for savings, alerts you to prevent overdrafts before they happen, and provides personalised guidance for your unique goals. You can also enable optional automated actions (like transfers to savings) with your explicit permission. Think of it as a financial brain that works 24/7 for your family."
    },
    {
      question: "Can both partners access the same Envis account?",
      answer: "Yes! Envis is designed for families. You can both access the same account, see all connected accounts (personal and joint), and work together towards shared financial goals. It's the first financial tool built specifically for couples and families to manage money together."
    },
    {
      question: "What happens to my data if I stop using Envis?",
      answer: "You're always in control of your data. If you decide to stop using Envis, you can disconnect your accounts at any time and request complete deletion of your data. We'll remove all your information from our systems within 30 days, in full compliance with GDPR regulations."
    },
    {
      question: "Is Envis regulated by the FCA?",
      answer: "We operate under FCA-aligned principles and use regulated Open Banking infrastructure for all account connections. We work with FCA-authorised Open Banking providers to ensure your data is handled with the highest standards of security and compliance."
    }
  ];

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'faq-schema';
    
    const existingScript = document.getElementById('faq-schema');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('faq-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <section id="faq" className="py-16 md:py-24 bg-card/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about security, privacy, and how Envis works
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-background"
              data-testid={`faq-${index}`}
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-semibold text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
