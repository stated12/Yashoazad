# Legal, cookies and analytics: confirmations and checks

## Cookie / consent assessment
- The site sets no cookies of its own (verify in browser dev tools, Application > Cookies).
- One localStorage item: `ya_consent_v1` (remembers the analytics choice).
- Vercel Web Analytics: Vercel documents it as working without third-party cookies, identifying visitors by a hash of the request. It does not say whether first-party cookies are used; verify after deploy.
- Google Fonts is loaded by CSS @import, so visitors' IPs reach Google. Consider self-hosting (next/font) later.
- Implemented: a non-blocking notice with OK / turn off / settings, and a "Cookie settings" link in every footer. Mode is set in `lib/consent.ts` (`CONSENT_MODE`): "notice" (analytics on, opt-out) or "opt-in" (off until accepted). Which is required is a legal decision: ask counsel, especially if EU/UK visitors matter.
- Not claimed operational until tested.

## Details to confirm (all highlighted on the pages while `LEGAL.showFlags` is true)
1. Legal name and postal address of the operator
2. Privacy contact email; grievance officer name and contact
3. Retention periods and deletion process
4. Regions of Supabase, Resend and Vercel; international transfers
5. "We do not sell personal information" statement
6. Children / minors wording (student programmes are planned)
7. Governing law and courts
8. Copyright owner; licensing of images and covers
9. Refund and cancellation terms (consults, workshops, subscriptions); needed by Razorpay
10. Analytics mode (notice vs opt-in) and whether Vercel sets any first-party cookie
11. Lawyer review of all four pages (India DPDP Act 2023 and any other jurisdictions)

## To finish
Fill the values in `lib/legal.ts`, replace the remaining flagged text, then set `status: "approved"` and `showFlags: false`. Until then the pages are noindex and show a draft banner.

## Deploy checks
1. Vercel: project > Analytics > Enable Web Analytics.
2. Deploy a preview. Banner appears on first visit; footer "Cookie settings" reopens it.
3. Turn analytics off: no `/_vercel/insights` requests in the network tab.
4. No cookies listed in dev tools.
5. All footer and legal links, and the four social links (including the Facebook share link), open on mobile and desktop.
