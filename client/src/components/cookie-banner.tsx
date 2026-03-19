import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  hasConsented,
  acceptAll,
  rejectAll,
  setConsent,
  getConsent,
  initConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    initConsent();
    if (!hasConsented()) {
      setVisible(true);
    }
  }, []);

  function handleAcceptAll() {
    acceptAll();
    setVisible(false);
  }

  function handleRejectAll() {
    rejectAll();
    setVisible(false);
  }

  function handleSavePreferences() {
    setConsent({
      essential: true,
      analytics: analyticsEnabled,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6" data-testid="cookie-banner">
      <div className="mx-auto max-w-2xl rounded-xl border bg-card shadow-lg">
        <div className="p-4 sm:p-6">
          {!showPreferences ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">We value your privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    We use essential cookies to make our site work and analytics cookies to understand how you use it. You can accept all, reject non-essential cookies, or{" "}
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="text-primary hover:underline font-medium"
                      data-testid="cookie-manage-link"
                    >
                      manage your preferences
                    </button>
                    . See our{" "}
                    <Link href="/privacy#cookies" className="text-primary hover:underline font-medium">
                      Cookie Policy
                    </Link>{" "}
                    for details.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  data-testid="cookie-reject-all"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  data-testid="cookie-accept-all"
                >
                  Accept All
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">Cookie Preferences</h3>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Back"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                  <div>
                    <p className="text-sm font-medium">Essential Cookies</p>
                    <p className="text-xs text-muted-foreground">Required for the website to function properly</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Always On</span>
                </div>

                <label className="flex items-center justify-between p-3 rounded-lg bg-background/50 border cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Analytics Cookies</p>
                    <p className="text-xs text-muted-foreground">Help us understand how visitors use our site (Google Analytics)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    data-testid="cookie-analytics-toggle"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  data-testid="cookie-reject-all-prefs"
                >
                  Reject All
                </Button>
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                  data-testid="cookie-save-preferences"
                >
                  Save Preferences
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
