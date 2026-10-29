import type { Metadata } from "next";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Students and Learning",
  description: "Resources, lectures and programmes for UPSC aspirants, university students and young professionals.",
  alternates: { canonical: "/learn" },
};

const AUDIENCES = [
  ["UPSC aspirants", "Governance explainers, public-administration resources, reading lists and specialist masterclasses."],
  ["University students", "Lectures and discussions for law, political science, public administration, international relations, security studies, journalism and public policy."],
  ["Young professionals", "Workshops on ethical decision-making, leadership, institutional responsibility and public trust."],
  ["General readers", "Accessible resources on institutions, governance, transparency and citizens' rights."],
];
const OFFERINGS = [
  ["Selected articles and reading resources", "Free"],
  ["Selected public lectures and reading lists", "Free"],
  ["Specialist recorded masterclasses", "Paid, where appropriate"],
  ["Live workshops and Q&A sessions", "Paid, where appropriate"],
  ["University and institutional programmes", "Fee by agreement"],
];

export default function Learn() {
  return (
    <>
      <PageHero eyebrow="Students & Learning" title="Learn from four decades of public service.">
        Resources, lectures and programmes that make this experience useful to students, aspirants and young professionals.
      </PageHero>
      <Section>
        <Eyebrow>Who it is for</Eyebrow>
        <div className="grid gap-4 md:grid-cols-2">
          {AUDIENCES.map(([t, b]) => <Card key={t} title={t}>{b}</Card>)}
        </div>
      </Section>
      <Section tone="soft">
        <Eyebrow>What is offered, and how</Eyebrow>
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          {OFFERINGS.map(([o, a], i) => (
            <div key={o} className={`flex items-center justify-between gap-4 px-5 py-4 text-sm ${i ? "border-t border-line" : ""}`}>
              <span className="text-ink">{o}</span>
              <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold-deep">{a}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Programme dates, content and fees will be announced here. Online registration and payment will open with the programmes.</p>
      </Section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2 items-start">
          <div>
            <Eyebrow>Register your interest</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-navy-deep">Tell us what would help you most.</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">You will be told first when lectures, masterclasses and workshops open.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6"><EnquiryForm type="learning" /></div>
        </div>
      </Section>
    </>
  );
}
