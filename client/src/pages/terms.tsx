import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Envis - AI-Powered Family Financial Coach";
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
            <h1 className="text-3xl font-bold mb-2" data-testid="heading-terms-of-service">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
              Last updated: October 1, 2025
            </p>

            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of the Envis website and services. By accessing or using our service, you agree to be bound by these Terms. Please read them carefully.
              </p>
            </div>

            <Separator className="my-8" />

            <nav className="mb-8">
              <h2 className="text-lg font-semibold mb-4" data-testid="heading-table-of-contents">Table of Contents</h2>
              <ol className="space-y-2 text-sm">
                <li><a href="#service-overview" className="text-primary hover:underline" data-testid="link-toc-service-overview">1. Service Overview</a></li>
                <li><a href="#eligibility" className="text-primary hover:underline" data-testid="link-toc-eligibility">2. Eligibility</a></li>
                <li><a href="#waitlist-terms" className="text-primary hover:underline" data-testid="link-toc-waitlist">3. Waitlist and Account Terms</a></li>
                <li><a href="#open-banking" className="text-primary hover:underline" data-testid="link-toc-open-banking">4. Open Banking Services</a></li>
                <li><a href="#no-financial-advice" className="text-primary hover:underline" data-testid="link-toc-no-advice">5. No Financial Advice</a></li>
                <li><a href="#acceptable-use" className="text-primary hover:underline" data-testid="link-toc-acceptable-use">6. Acceptable Use</a></li>
                <li><a href="#intellectual-property" className="text-primary hover:underline" data-testid="link-toc-ip">7. Intellectual Property</a></li>
                <li><a href="#third-party-services" className="text-primary hover:underline" data-testid="link-toc-third-party">8. Third-Party Services</a></li>
                <li><a href="#service-availability" className="text-primary hover:underline" data-testid="link-toc-availability">9. Service Availability</a></li>
                <li><a href="#limitation-of-liability" className="text-primary hover:underline" data-testid="link-toc-liability">10. Limitation of Liability</a></li>
                <li><a href="#termination" className="text-primary hover:underline" data-testid="link-toc-termination">11. Termination</a></li>
                <li><a href="#governing-law" className="text-primary hover:underline" data-testid="link-toc-governing-law">12. Governing Law</a></li>
                <li><a href="#privacy" className="text-primary hover:underline" data-testid="link-toc-privacy">13. Privacy</a></li>
                <li><a href="#contact" className="text-primary hover:underline" data-testid="link-toc-contact">14. Contact Information</a></li>
              </ol>
            </nav>

            <Separator className="my-8" />

            <div className="space-y-8">
              <section id="service-overview">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-service-overview">1. Service Overview</h2>
                <p className="text-muted-foreground mb-3">
                  Envis is an AI-powered financial coaching platform designed to help UK families manage their finances more effectively. We are currently in pre-launch phase, building a waitlist for early access.
                </p>
                <p className="text-muted-foreground">
                  Our service will use Open Banking technology to provide personalised financial guidance, automated savings recommendations, and bill management tools. Please note that we are not authorised or regulated by the Financial Conduct Authority (FCA) to provide financial advice.
                </p>
              </section>

              <Separator />

              <section id="eligibility">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-eligibility">2. Eligibility</h2>
                <p className="text-muted-foreground mb-3">
                  To use Envis, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Be a resident of the United Kingdom</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Provide accurate and complete information when registering</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  By using our service, you represent and warrant that you meet these eligibility requirements.
                </p>
              </section>

              <Separator />

              <section id="waitlist-terms">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-waitlist-terms">3. Waitlist and Account Terms</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    By joining our waitlist, you agree to receive email communications from us regarding early access, product updates, and service information. You can unsubscribe at any time using the link in our emails.
                  </p>
                  <p>
                    <strong>No Guarantee of Access:</strong> Joining the waitlist does not guarantee access to our service when it launches. We will invite users based on availability and eligibility criteria.
                  </p>
                  <p>
                    <strong>Beta Status:</strong> When the service launches, it may be provided on a beta or trial basis. Features, functionality, and pricing may change without notice during this period.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="open-banking">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-open-banking">4. Open Banking Services</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    When our service launches, we will access your financial data through FCA-authorised Account Information Service Providers (AISPs) using Open Banking technology.
                  </p>
                  <p>
                    <strong>Read-Only Access:</strong> We only request read-only access to your financial accounts. We cannot move money, make payments, or modify your accounts unless you explicitly grant additional permissions for payment initiation services.
                  </p>
                  <p>
                    <strong>Your Control:</strong> You control which accounts you connect and can disconnect them at any time. You are responsible for maintaining the security of your online banking credentials.
                  </p>
                  <p>
                    <strong>Third-Party Providers:</strong> Open Banking connections are facilitated by FCA-authorised third-party providers. We will clearly identify these providers before you connect your accounts.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="no-financial-advice">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-no-financial-advice">5. No Financial Advice</h2>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md p-4 mb-3">
                  <p className="text-foreground font-semibold mb-2">Important Disclaimer</p>
                  <p className="text-muted-foreground">
                    Envis provides general financial information and guidance only. We do not provide regulated financial advice, investment advice, or recommendations to buy or sell financial products.
                  </p>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    The information and tools provided by Envis are for educational and informational purposes. You should:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Conduct your own research before making financial decisions</li>
                    <li>Seek independent financial advice from FCA-authorised advisers for significant decisions</li>
                    <li>Consider your personal circumstances and risk tolerance</li>
                    <li>Understand that past performance does not guarantee future results</li>
                  </ul>
                  <p className="mt-3">
                    We operate under FCA-aligned principles but are not authorised to provide regulated financial advice.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="acceptable-use">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-acceptable-use">6. Acceptable Use</h2>
                <p className="text-muted-foreground mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Use the service for any unlawful purpose or in violation of these Terms</li>
                  <li>Attempt to gain unauthorised access to our systems or other users' accounts</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use automated systems to access the service without our permission</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Share your account credentials with others</li>
                  <li>Use the service to transmit harmful code or malware</li>
                </ul>
              </section>

              <Separator />

              <section id="intellectual-property">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-intellectual-property">7. Intellectual Property</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    All content, features, and functionality of the Envis service, including but not limited to text, graphics, logos, software, and algorithms, are owned by Envis and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    <strong>Feedback Licence:</strong> If you provide feedback, suggestions, or ideas about our service, you grant us a perpetual, worldwide, royalty-free licence to use, modify, and incorporate such feedback into our service without compensation or attribution.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="third-party-services">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-third-party-services">8. Third-Party Services</h2>
                <p className="text-muted-foreground">
                  Our service may integrate with third-party services, including Open Banking providers, payment processors, and analytics platforms. Your use of these third-party services is subject to their respective terms and privacy policies. We are not responsible for the availability, accuracy, or content of third-party services.
                </p>
              </section>

              <Separator />

              <section id="service-availability">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-service-availability">9. Service Availability</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We strive to provide reliable service but cannot guarantee uninterrupted access. The service is provided "as is" and "as available" without warranties of any kind.
                  </p>
                  <p>
                    <strong>Beta Nature:</strong> During pre-launch and beta periods, the service may contain bugs, errors, or incomplete features. We may modify, suspend, or discontinue features at any time without notice.
                  </p>
                  <p>
                    <strong>Maintenance:</strong> We may perform scheduled or emergency maintenance that temporarily interrupts service access.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="limitation-of-liability">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-limitation-of-liability">10. Limitation of Liability</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    To the fullest extent permitted by law, Envis and its directors, employees, and partners shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Any indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Financial losses resulting from reliance on our service</li>
                    <li>Damages arising from third-party services or Open Banking providers</li>
                    <li>Errors, omissions, or inaccuracies in the information provided</li>
                  </ul>
                  <p className="mt-3">
                    <strong>No Warranties:</strong> The service is provided without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                  </p>
                  <p>
                    Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="termination">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-termination">11. Termination</h2>
                <p className="text-muted-foreground mb-3">
                  You may stop using our service at any time by unsubscribing from our waitlist or deleting your account when the service launches.
                </p>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your access to our service at any time, with or without notice, for any reason, including violation of these Terms, suspected fraud, or any conduct we deem harmful to other users or our business.
                </p>
              </section>

              <Separator />

              <section id="governing-law">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-governing-law">12. Governing Law</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms or your use of the service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                  <p>
                    <strong>Complaints:</strong> If you have a complaint about our service, please contact us first at <a href="mailto:team@envis.money" className="text-primary hover:underline">team@envis.money</a>. We are committed to resolving issues fairly and promptly.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="privacy">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-privacy">13. Privacy</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our <Link href="/privacy" className="text-primary hover:underline" data-testid="link-privacy-policy">Privacy Policy</Link> to understand how we collect, use, and protect your personal information. By using our service, you agree to the terms of our Privacy Policy.
                </p>
              </section>

              <Separator />

              <section id="contact">
                <h2 className="text-xl font-semibold mb-3" data-testid="heading-contact">14. Contact Information</h2>
                <p className="text-muted-foreground mb-3">
                  If you have questions about these Terms of Service, please contact us:
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
