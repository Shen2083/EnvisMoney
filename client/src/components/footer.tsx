import { Mail } from "lucide-react";
import { Link } from "wouter";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:gap-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              The AI-powered financial coach for UK families.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <a href="mailto:hello@envis.money" className="hover:text-foreground transition-colors" data-testid="link-contact-email">
                  hello@envis.money
                </a>
              </p>
              <div className="flex gap-3">
                <a
                  href="mailto:hello@envis.money"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md hover-elevate"
                  aria-label="Email"
                  data-testid="link-email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy-footer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms-footer">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t space-y-4">
          <div className="text-xs text-muted-foreground leading-relaxed max-w-5xl mx-auto">
            <p className="mb-3">
              <strong>Important Information:</strong> Envis uses Open Banking technology to provide financial guidance and automation. We operate under FCA-aligned principles and work with FCA-authorised Open Banking providers. The information provided by Envis is for general guidance only and should not be considered as financial advice. You should seek independent financial advice before making significant financial decisions.
            </p>
            <p>
              Your capital and financial security are important. All data is encrypted using bank-level 256-bit encryption, and we only use read-only access to your accounts. We cannot move money or make changes to your accounts. You can disconnect your accounts and delete your data at any time. GDPR compliant and committed to protecting your privacy.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>© 2025 Envis. All rights reserved. Made with care for UK families.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
