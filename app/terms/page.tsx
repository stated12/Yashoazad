import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Confirm, H, LegalPage, Value, noindexWhileDraft } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using this website and sending enquiries through it.",
  alternates: { canonical: "/terms" },
  robots: noindexWhileDraft(),
};

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      intro="By using this website you agree to these terms. If you do not agree, please do not use it."
    >
      <H>1. About this website</H>
      <p>
        This is the personal website of Yashovardhan Jha Azad, operated by{" "}
        <Value v={LEGAL.operator} label="legal name and postal address of the person or entity running the site" />.
        It is not an official website of any government body, police force or public authority, and nothing on it is an official statement of any of them. Views expressed are the author&apos;s own.
      </p>

      <H>2. Information only</H>
      <p>
        Articles, books, talks and other content are provided for general information and discussion. They are not legal, security, financial, professional or other advice, and you should not rely on them as such. We try to keep content accurate but do not promise that it is complete or current.
      </p>

      <H>3. Enquiries and booking requests</H>
      <p>
        Sending a speaking, consulting, learning, Exclusive Insights or contact form is a request only. It is not a confirmed booking, and no engagement exists until it is confirmed in writing by us. Any fee, date, format and conditions will be agreed with you before a session or event is confirmed.
      </p>
      <p>
        Please do not send confidential, classified, privileged or sensitive information through the forms. Do not submit information about other people unless you are entitled to.
      </p>

      <H>4. Acceptable use</H>
      <ul className="list-disc pl-6 space-y-2">
        <li>Do not use the site unlawfully, or to harass, defraud or mislead anyone.</li>
        <li>Do not attempt to disrupt, probe or gain unauthorised access to the site or its systems.</li>
        <li>Do not use automated means to submit forms or to copy the site in bulk.</li>
      </ul>

      <H>5. Intellectual property</H>
      <p>
        Unless stated otherwise, the content of this site (text, images, design) belongs to{" "}
        <Value v={LEGAL.operator ?? LEGAL.copyrightHolder} label="copyright owner" /> or its licensors. You may read, share links to, and quote short extracts with attribution for non-commercial purposes. Any other copying or reuse needs written permission.
        <Confirm>confirm the copyright owner and whether any images or book covers are licensed from others</Confirm>
      </p>

      <H>6. Links to other sites</H>
      <p>
        The site links to third-party websites and platforms, including social profiles and book retailers. We do not control them and are not responsible for their content or practices.
      </p>

      <H>7. Paid and members&apos; services</H>
      <p>
        Exclusive Insights, consulting sessions, programmes and other paid services are planned. Additional terms, prices and the{" "}
        <Link href="/refunds" className="text-gold-deep underline">Refund &amp; Cancellation</Link> page will apply to them and will be published before any payment is taken.
      </p>

      <H>8. Liability</H>
      <p>
        The site is provided &ldquo;as is&rdquo;. <Confirm>liability limits and disclaimers must be drafted or approved by a lawyer</Confirm>
      </p>

      <H>9. Governing law</H>
      <p>
        These terms are governed by the laws of <Value v={LEGAL.jurisdiction} label="governing law and courts, for example India and a named city" />.
      </p>

      <H>10. Changes and contact</H>
      <p>
        We may update these terms by posting a new version here. Questions can be sent to{" "}
        <Value v={LEGAL.privacyContact} label="contact email" /> or through the <Link href="/contact" className="text-gold-deep underline">contact page</Link>. See also the{" "}
        <Link href="/privacy" className="text-gold-deep underline">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
