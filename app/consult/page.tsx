import type { Metadata } from "next";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Consult",
  description: "Request a one-to-one session on governance, strategic risk, crisis preparedness or RTI with Yashovardhan Jha Azad.",
  alternates: { canonical: "/consult" },
};

export default function Consult() {
  return (
    <>
      <PageHero eyebrow="Consult" title="Request a one-to-one session.">
        Clearly scoped advisory and educational sessions for organisations and individuals, subject to availability and approval.
      </PageHero>
      <Section>
        <Eyebrow>Areas of discussion</Eyebrow>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Governance and institutional effectiveness">How institutions earn and keep public trust.</Card>
          <Card title="Strategic and security risk">Framing risk for organisations with exposure to security questions.</Card>
          <Card title="Crisis preparedness">Decision-making and coordination under pressure.</Card>
          <Card title="RTI and transparency">Citizens' rights, disclosure and accountability.</Card>
          <Card title="Leadership and ethics">Responsibility, integrity and institutional culture.</Card>
        </div>
      </Section>
      <Section tone="soft">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <Eyebrow>How booking works</Eyebrow>
            <ol className="space-y-4 text-sm leading-relaxed text-body list-decimal pl-5">
              <li>Send a request with up to three preferred times.</li>
              <li>Each request is reviewed and a reply follows with a time and the fee, if any.</li>
              <li>A session is confirmed only after both are agreed. Online payment and scheduling will be added to this page.</li>
            </ol>
            <div className="mt-6 rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-muted">
              Sessions are educational and advisory. They do not imply government endorsement, privileged access or confidential information, and no outcome is guaranteed.
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6"><EnquiryForm type="consult" /></div>
        </div>
      </Section>
    </>
  );
}
