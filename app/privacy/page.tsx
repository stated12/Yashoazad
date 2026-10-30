import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Confirm, H, LegalPage, Value, noindexWhileDraft } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this website handles the personal information you send through its forms and how visits are counted.",
  alternates: { canonical: "/privacy" },
  robots: noindexWhileDraft(),
};

const Row = ({ a, b, c }: { a: string; b: string; c: string }) => (
  <tr className="border-t border-line align-top">
    <td className="py-3 pr-4 font-medium text-ink">{a}</td>
    <td className="py-3 pr-4">{b}</td>
    <td className="py-3">{c}</td>
  </tr>
);

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page explains what personal information this website collects, why, and who handles it."
    >
      <H>1. Who runs this website</H>
      <p>
        This website is operated by <Value v={LEGAL.operator} label="legal name and postal address of the person or entity running the site" />.
        Privacy questions and requests can be sent to <Value v={LEGAL.privacyContact} label="email address for privacy requests" />.
      </p>

      <H>2. What we collect and why</H>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted">
              <th className="pb-2 pr-4 font-medium">Where</th>
              <th className="pb-2 pr-4 font-medium">What you give us</th>
              <th className="pb-2 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            <Row a="Contact form" b="Name, email, optional phone, enquiry type, message." c="To read and answer your enquiry." />
            <Row a="Speaking enquiry" b="Contact person, organisation, email, optional phone, topic, audience, preferred date, format, location, requirements." c="To consider and reply to a speaking request." />
            <Row a="Consulting booking request" b="Name, organisation, email, optional phone, area of discussion, mode, up to three preferred times, a short description, your confirmation of the request terms." c="To review a session request and reply with a time and any fee." />
            <Row a="Exclusive Insights request" b="Name, email, optional note on what you would like to read." c="To tell you when Exclusive Insights opens." />
            <Row a="Students and Learning interest" b="Name, email, who you are (for example student or aspirant), optional note." c="To tell you when lectures and programmes open." />
            <Row a="Newsletter" b="Email address." c="To tell you about new articles and announcements." />
          </tbody>
        </table>
      </div>
      <p>
        Please do not send confidential, classified or sensitive personal information through these forms.
      </p>
      <p>We also handle some information automatically:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Spam protection.</strong> When you submit a form, we save a one-way scrambled (hashed) form of your IP address with the enquiry so that we can limit repeated submissions. We do not save the IP address itself with the enquiry.
        </li>
        <li>
          <strong>Visit statistics.</strong> We use Vercel Web Analytics to count page views and referrers. Vercel states that it works without third-party cookies and identifies visitors by a hash created from the request rather than a stored ID. See the <Link href="/cookies" className="text-gold-deep underline">Cookie Policy</Link> to change your choice.
        </li>
        <li>
          <strong>Author sign-in.</strong> The site&apos;s author signs in to a private dashboard with an emailed code. This applies only to the author and not to visitors.
        </li>
        <li>
          <strong>Technical logs.</strong> Our hosting provider processes standard technical information (such as IP address and browser type) to deliver the site and keep it secure.
        </li>
      </ul>

      <H>3. Who handles your information for us</H>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Supabase</strong>: stores the enquiries you submit in a database that is not publicly accessible.</li>
        <li><strong>Supabase Storage</strong>: stores the photographs and short videos published in articles. These files are public by design.</li>
        <li><strong>YouTube or Vimeo</strong>: some articles embed videos. Nothing is loaded from them until you press play, at which point your browser connects to that service under its own privacy policy.</li>
        <li><strong>Resend</strong>: delivers each enquiry by email to the site owner&apos;s inbox.</li>
        <li><strong>Vercel</strong>: hosts the website and provides Web Analytics.</li>
        <li><strong>Google Fonts</strong>: the site&apos;s typefaces are loaded from Google, so your browser connects to Google&apos;s servers and your IP address is visible to Google when a page loads.</li>
      </ul>
      <p>
        When paid services open, a payment provider (Razorpay) will be added and this policy updated before any payment is taken.
        <Confirm>confirm this wording and update the policy before launching payments</Confirm>
      </p>
      <p>
        We do not sell personal information. <Confirm>confirm this statement reflects actual practice</Confirm>
      </p>

      <H>4. Where information is processed</H>
      <p>
        The providers above may process information on servers outside India.{" "}
        <Confirm>list the actual regions chosen for the database, email and hosting services</Confirm>
      </p>

      <H>5. How long we keep it</H>
      <p>
        <Confirm>retention period for enquiries and for newsletter emails, and how deletion is carried out</Confirm>
      </p>

      <H>6. Your choices and requests</H>
      <p>
        You can ask to see, correct or delete the information you have sent us, or ask to be removed from announcements, by writing to{" "}
        <Value v={LEGAL.privacyContact} label="privacy contact email" />. We will respond as required by applicable law.{" "}
        <Confirm>confirm response time and the exact rights offered, with legal advice on India&apos;s Digital Personal Data Protection Act, 2023</Confirm>
      </p>
      <p>
        Complaints can be sent to <Value v={LEGAL.grievanceOfficer} label="name and contact details of the person who handles complaints" />.
      </p>

      <H>7. Security</H>
      <p>
        The site is served over HTTPS and stored enquiries are kept in a database with no public access. No online service is completely secure, so we cannot guarantee absolute security.
      </p>

      <H>8. Children</H>
      <p>
        This website is intended for adults and is not directed at children.{" "}
        <Confirm>confirm, particularly because student programmes are planned</Confirm>
      </p>

      <H>9. Changes to this policy</H>
      <p>We will post any changes on this page and update the date above.</p>
    </LegalPage>
  );
}
