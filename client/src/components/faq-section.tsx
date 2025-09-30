import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Is my financial data safe with Envis?",
      answer: "Absolutely. We use bank-level encryption and are built on FCA-regulated Open Banking technology. We can only read your transaction data—we can never move money or make changes to your accounts. You control what data you share and can revoke access anytime."
    },
    {
      question: "How much does Envis cost?",
      answer: "We'll announce pricing details closer to launch. Early waiting list members will receive exclusive pricing and benefits. Our goal is to make professional financial coaching accessible to all UK families."
    },
    {
      question: "When will Envis launch?",
      answer: "We're targeting a Feb 2026 launch for our beta programme. Waiting list members will be the first to get access and help shape the final product with their feedback."
    },
    {
      question: "Which banks are supported?",
      answer: "Through Open Banking, we support all major UK banks and building societies, including Barclays, HSBC, Lloyds, NatWest, Santander, and many more. If your bank supports Open Banking (most do), it will work with Envis."
    },
    {
      question: "Can Envis help with investments and pensions?",
      answer: "Initially, Envis will focus on everyday family finances—budgeting, spending, and savings. As Open Finance regulations expand, we'll add support for investments, pensions, mortgages, and insurance to give you a complete financial picture."
    },
    {
      question: "How is this different from my banking app?",
      answer: "While banking apps show you transactions, Envis is your proactive AI coach. We analyse spending across all your family's accounts, predict upcoming expenses, suggest savings opportunities, and alert you before issues arise. Think of it as having a personal financial advisor for your whole family."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Envis
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
