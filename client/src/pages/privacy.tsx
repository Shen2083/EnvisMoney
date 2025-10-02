import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Envis - AI-Powered Family Financial Coach";
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8 sm:p-12">
            <h1 className="text-3xl font-bold mb-2" data-testid="heading-privacy-policy">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
              Last updated: October 1, 2025
            </p>

            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-muted-foreground">
                This Privacy Policy explains how Envis ("we", "us", or "our") collects, uses, and protects your personal information when you use our website and services. We are committed to protecting your privacy and handling your data in accordance with UK GDPR and the Data Protection Act 2018.
              </p>
            </div>

            <Separator className="my-8" />

            <nav className="mb-8">
              <h2 className="text-lg font-semibold mb-4" data-testid="heading-table-of-contents">Table of Contents</h2>
              <ol className="space-y-2 text-sm">
                <li><a href="#who-we-are" className="text-primary hover:underline" data-testid="link-toc-who-we-are">1. Who We Are</a></li>
                <li><a href="#information-we-collect" className="text-primary hover:underline" data-testid="link-toc-information">2. Information We Collect</a></li>
                <li><a href="#lawful-basis" className="text-primary hover:underline" data-testid="link-toc-lawful-basis">3. Lawful Basis for Processing</a></li>
                <li><a href="#how-we-use" className="text-primary hover:underline" data-testid="link-toc-how-we-use">4. How We Use Your Information</a></li>
                <li><a href="#sharing" className="text-primary hover:underline" data-testid="link-toc-sharing">5. Sharing Your Information</a></li>
                <li><a href="#international-transfers" className="text-primary hover:underline" data-testid="link-toc-international">6. International Transfers</a></li>
                <li><a href="#retention" className="text-primary hover:underline" data-testid="link-toc-retention">7. Data Retention</a></li>
                <li><a href="#your-rights" className="text-primary hover:underline" data-testid="link-toc-rights">8. Your Rights</a></li>
                <li><a href="#cookies" className="text-primary hover:underline" data-testid="link-toc-cookies">9. Cookies and Tracking</a></li>
                <li><a href="#security" className="text-primary hover:underline" data-testid="link-toc-security">10. Security</a></li>
                <li><a href="#children" className="text-primary hover:underline" data-testid="link-toc-children">11. Children's Privacy</a></li>
                <li><a href="#changes" className="text-primary hover:underline" data-testid="link-toc-changes">12. Changes to This Policy</a></li>
                <li><a href="#complaints" className="text-primary hover:underline" data-testid="link-toc-complaints">13. Complaints</a></li>
                <li><a href="#contact" className="text-primary hover:underline" data-testid="link-toc-contact">14. Contact Us</a></li>
              </ol>
            </nav>

            <Separator className="my-8" />

            <div className="space-y-8">
              <section id="who-we-are">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-who-we-are">1. Who We Are</h2>
                <p className="text-muted-foreground mb-3">
                  Envis is the data controller responsible for your personal information. We are an AI-powered financial coaching service designed to help UK families manage their finances more effectively.
                </p>
                <p className="text-muted-foreground">
                  <strong>Contact Details:</strong><br />
                  Email: <a href="mailto:team@envis.money" className="text-primary hover:underline" data-testid="link-contact-email-policy">team@envis.money</a>
                </p>
              </section>

              <Separator />

              <section id="information-we-collect">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-information-we-collect">2. Information We Collect</h2>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Waitlist Information</h3>
                    <p>When you join our waitlist, we collect your email address to communicate with you about early access and service updates.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Website Analytics</h3>
                    <p>We collect anonymous usage data including pages visited, browser type, and device information to improve our website and services.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Open Banking Data (Future)</h3>
                    <p>When our service launches, we will access your financial data via FCA-authorised Account Information Service Providers (AISPs) using Open Banking technology. This access is read-only, and we cannot move money or make changes to your accounts. We will only access data you explicitly authorise us to view.</p>
                  </div>
                </div>
              </section>

              <Separator />

              <section id="lawful-basis">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-lawful-basis">3. Lawful Basis for Processing</h2>
                <p className="text-muted-foreground mb-3">
                  We process your personal data under the following lawful bases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Consent:</strong> For marketing communications and waitlist updates (you can withdraw consent at any time)</li>
                  <li><strong>Legitimate Interests:</strong> To operate and improve our service, prevent fraud, and ensure security</li>
                  <li><strong>Contract:</strong> To provide the services you've requested when our product launches</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <Separator />

              <section id="how-we-use">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-how-we-use">4. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-3">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Send waitlist communications and early access invitations</li>
                  <li>Provide and improve our financial coaching services</li>
                  <li>Analyse and understand how families use our service</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Respond to your enquiries and provide customer support</li>
                </ul>
              </section>

              <Separator />

              <section id="sharing">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-sharing">5. Sharing Your Information</h2>
                <p className="text-muted-foreground mb-3">
                  We do not sell your personal data. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Service Providers:</strong> Hosting providers, email service providers, and analytics platforms who process data on our behalf</li>
                  <li><strong>Open Banking Providers:</strong> FCA-authorised AISPs who facilitate secure, read-only access to your financial data</li>
                  <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets (with appropriate safeguards)</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  All third-party processors are carefully selected and bound by data processing agreements to protect your information.
                </p>
              </section>

              <Separator />

              <section id="international-transfers">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-international-transfers">6. International Transfers</h2>
                <p className="text-muted-foreground">
                  Some of our service providers may be located outside the UK. Where we transfer data internationally, we ensure appropriate safeguards are in place, including UK GDPR-compliant Standard Contractual Clauses and adequacy decisions where applicable.
                </p>
              </section>

              <Separator />

              <section id="retention">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-retention">7. Data Retention</h2>
                <p className="text-muted-foreground mb-3">
                  We retain your personal data only for as long as necessary:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Waitlist Data:</strong> Until you request deletion or 24 months after our service launches</li>
                  <li><strong>Account Data:</strong> For the duration of your account plus 6 years for financial records (regulatory requirement)</li>
                  <li><strong>Analytics Data:</strong> Anonymised data may be retained indefinitely for statistical purposes</li>
                </ul>
              </section>

              <Separator />

              <section id="your-rights">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-your-rights">8. Your Rights</h2>
                <p className="text-muted-foreground mb-3">
                  Under UK GDPR, you have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing at any time</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  To exercise any of these rights, please contact us at <a href="mailto:team@envis.money" className="text-primary hover:underline">team@envis.money</a>.
                </p>
              </section>

              <Separator />

              <section id="cookies">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-cookies">9. Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-3">
                  We use essential cookies to ensure our website functions properly and analytics cookies to understand how visitors use our site. You can control cookie preferences through your browser settings.
                </p>
                <div className="text-muted-foreground">
                  <h3 className="font-semibold text-foreground mb-2">Types of Cookies:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Essential:</strong> Required for website functionality</li>
                    <li><strong>Analytics:</strong> Help us understand usage patterns (anonymised)</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section id="security">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-security">10. Security</h2>
                <p className="text-muted-foreground">
                  We implement bank-level security measures to protect your data, including 256-bit encryption for data in transit and at rest. All Open Banking connections use read-only access, meaning we cannot move money or modify your accounts. We regularly review and update our security practices to protect against unauthorised access, disclosure, or loss.
                </p>
              </section>

              <Separator />

              <section id="children">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-children">11. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <Separator />

              <section id="changes">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-changes">12. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a prominent notice on our website. The "Last updated" date at the top indicates when this policy was last revised.
                </p>
              </section>

              <Separator />

              <section id="complaints">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-complaints">13. Complaints</h2>
                <p className="text-muted-foreground mb-3">
                  If you have concerns about how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):
                </p>
                <div className="text-muted-foreground">
                  <p><strong>Information Commissioner's Office</strong></p>
                  <p>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-testid="link-ico">ico.org.uk</a></p>
                  <p>Helpline: 0303 123 1113</p>
                </div>
              </section>

              <Separator />

              <section id="contact">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-contact">14. Contact Us</h2>
                <p className="text-muted-foreground mb-3">
                  If you have any questions about this Privacy Policy or how we handle your personal data, please contact us:
                </p>
                <div className="text-muted-foreground">
                  <p><strong>Envis</strong></p>
                  <p>Email: <a href="mailto:team@envis.money" className="text-primary hover:underline" data-testid="link-contact-email-bottom">team@envis.money</a></p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-6 border-t">
              <Button
                onClick={scrollToTop}
                variant="ghost"
                className="w-full sm:w-auto"
                data-testid="button-back-to-top"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
