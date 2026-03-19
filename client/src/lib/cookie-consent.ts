const CONSENT_KEY = "envis_cookie_consent";
const GA_ID = "G-LTJ7XSCEKS";

export type CookieCategory = "essential" | "analytics";

export interface CookieConsent {
  essential: boolean; // always true
  analytics: boolean;
  timestamp: string;
}

export function getConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setConsent(consent: CookieConsent): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  applyConsent(consent);
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics === true;
}

export function acceptAll(): void {
  setConsent({
    essential: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  });
}

export function rejectAll(): void {
  setConsent({
    essential: true,
    analytics: false,
    timestamp: new Date().toISOString(),
  });
}

export function applyConsent(consent: CookieConsent): void {
  if (consent.analytics) {
    loadGoogleAnalytics();
  } else {
    removeGoogleAnalytics();
  }
}

function loadGoogleAnalytics(): void {
  // Don't load twice
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

function removeGoogleAnalytics(): void {
  // Remove GA script tags
  const scripts = document.querySelectorAll(`script[src*="googletagmanager.com"]`);
  scripts.forEach((s) => s.remove());

  // Clear GA cookies
  const gaCookies = document.cookie.split(";").filter((c) => c.trim().startsWith("_ga"));
  gaCookies.forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.envis.money`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // Clear dataLayer
  window.dataLayer = [];
  window.gtag = undefined;
}

/** Initialise consent on app start — applies saved preference or does nothing */
export function initConsent(): void {
  const consent = getConsent();
  if (consent) {
    applyConsent(consent);
  }
}
