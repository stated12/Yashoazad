import type { Metadata } from "next";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Speaking and Engagements",
  description: "Invite Yashovardhan Jha Azad to speak at a university, conference or institution.",
  alternates: { canonical: "/speaking" },
};

export default function Speaking() {
  return (
    <>
      <PageHero eyebrow="Speaking & Engagements" title="Invite him to speak.">
        Lectures, panel discussions, workshops and programmes for universities, colleges, conferences, research bodies and suitable organisations.
      </PageHero>
      <Section>
        <Eyebrow>Topics</Eyebrow>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="National security and strategy">Preparedness, strategic risk and emerging challenges.</Card>
          <Card title="Policing and public trust">Police reform, investigation, accountability and institutional effectiveness.</Card>
          <Card title="Governance, RTI and ethics">Transparency, citizens' rights, decision-making and leadership under pressure.</Card>
        </div>
      </Section>
      <Section tone="soft">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <ol className="space-y-4 text-sm leading-relaxed text-body list-decimal pl-5">
              <li>Send your enquiry with the topic, audience, date and format.</li>
              <li>Availability is checked and a reply follows.</li>
              <li>Engagements are confirmed only after availability and terms are agreed in writing.</li>
            </ol>
            <p className="mt-6 text-xs text-muted">Engagements are subject to his availability and approval.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6"><EnquiryForm type="speaking" /></div>
        </div>
      </Section>
    </>
  );
}
