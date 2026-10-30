// Cookie and analytics preference. Safe to import in client components.
//
// CONSENT_MODE decides what happens before a visitor has made a choice:
//   "notice": analytics runs, the visitor is told, and can switch it off at any time.
//   "opt-in": analytics stays OFF until the visitor allows it.
// This site sets no cookies of its own, and Vercel Web Analytics is documented as working without
// third-party cookies. The mode to use is a legal decision to confirm; see docs/LEGAL_CONFIRMATIONS.md.
export const CONSENT_MODE: "notice" | "opt-in" = "notice";

export const CONSENT_KEY = "ya_consent_v1";
export const CONSENT_EVENT = "ya-consent-changed";
export const OPEN_EVENT = "ya-open-cookie-settings";

export type Consent = { analytics: boolean; at: string } | null;

export function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return typeof v?.analytics === "boolean" ? { analytics: v.analytics, at: String(v.at || "") } : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, at: new Date().toISOString() }));
  } catch {
    /* storage unavailable: the choice applies for this page view only */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function analyticsAllowed(): boolean {
  const c = readConsent();
  if (c) return c.analytics;
  return CONSENT_MODE === "notice";
}
