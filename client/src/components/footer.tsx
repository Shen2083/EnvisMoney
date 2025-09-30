import { Mail, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Envis</h3>
            <p className="text-sm text-muted-foreground">
              The AI-powered financial coach for UK families.
            </p>
            <div className="flex gap-3">
              <button
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover-elevate"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover-elevate"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover-elevate"
                aria-label="Email"
                data-testid="link-email"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-how-it-works-footer">
                  How it Works
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-pricing-footer">
                  Pricing
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-security-footer">
                  Security
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-about-footer">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-blog-footer">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-careers-footer">
                  Careers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-privacy-footer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-terms-footer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-compliance-footer">
                  FCA Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Envis. All rights reserved. Envis is committed to FCA compliance and consumer protection.</p>
        </div>
      </div>
    </footer>
  );
}
