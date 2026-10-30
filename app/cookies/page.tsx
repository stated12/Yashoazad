import type { Metadata } from "next";
import Link from "next/link";
import { Confirm, H, LegalPage, noindexWhileDraft } from "@/components/Legal";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and similar technologies used on this website, and how to control them.",
  alternates: { canonical: "/cookies" },
  robots: noindexWhileDraft(),
};

const Row = ({ a, b, c, d }: { a: string; b: string; c: string; d: string }) => (
  <tr className="border-t border-line align-top">
    <td className="py-3 pr-4 font-medium text-ink">{a}</td>
    <td className="py-3 pr-4">{b}</td>
    <td className="py-3 pr-4">{c}</td>
    <td className="py-3">{d}</td>
  </tr>
);

export default function Cookies() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      intro="This page lists what this website stores on your device or loads from other services, and how you can control it."
    >
      <H>1. Cookies set by this website</H>
      <p>
        This website does not set any cookies for visitors at present. The only cookie it sets is <strong>ya_author</strong>, a strictly necessary sign-in cookie used only when the site&apos;s author signs in to the private dashboard at /author.{" "}
        <Confirm>check in a browser&apos;s developer tools after launch that no cookies are set, and update this page if any appear</Confirm>
      </p>

      <H>2. Other storage and services</H>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted">
              <th className="pb-2 pr-4 font-medium">Item</th>
              <th className="pb-2 pr-4 font-medium">Purpose</th>
              <th className="pb-2 pr-4 font-medium">Type</th>
              <th className="pb-2 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            <Row a="ya_consent_v1" b="Remembers your analytics choice." c="Browser local storage on your device (not a cookie). Essential." d="Until you clear your browser data or change the choice." />
            <Row a="ya_author" b="Keeps the site's author signed in to the private dashboard." c="First-party cookie, essential. Set only on /author after sign-in; never set for visitors." d="Up to 30 days, or until the author signs out." />
            <Row a="YouTube / Vimeo videos" b="Plays videos embedded in some articles." c="Nothing is loaded until you press play. After that the provider's own cookies and policies apply." d="Set by the provider." />
            <Row a="Vercel Web Analytics" b="Counts page views and referrers to understand how the site is used." c="Analytics. Vercel states it works without third-party cookies and identifies visitors by a hash of the request." d="Vercel states that visitor sessions are discarded after 24 hours." />
            <Row a="Google Fonts" b="Delivers the site's typefaces." c="No cookie is set by us. Your browser requests the fonts from Google, which can see your IP address." d="Per request." />
          </tbody>
        </table>
      </div>
      <p>
        <Confirm>confirm the analytics approach (notice with opt-out, or opt-in) and whether Vercel Web Analytics sets any first-party cookie, by checking in a browser after launch</Confirm>
      </p>

      <H>3. Your choices</H>
      <p>
        You can allow or turn off analytics at any time:{" "}
        <CookieSettingsButton className="text-gold-deep underline underline-offset-2" />. The same link is in the footer of every page.
        You can also block or delete cookies and local storage in your browser settings. Turning analytics off does not affect your use of the site or its forms.
      </p>

      <H>4. Future changes</H>
      <p>
        Members&apos; sign-in and online payments are planned. When they launch, essential cookies for signing in and cookies from the payment provider will be added to this policy before they are used.
      </p>

      <p>
        See also the <Link href="/privacy" className="text-gold-deep underline">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
