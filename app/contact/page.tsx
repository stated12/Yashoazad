import type { Metadata } from "next";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Yashovardhan Jha Azad for media, academic, institutional and professional enquiries.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch.">
        Choose the enquiry type that fits. Messages are read personally and answered as time allows.
      </PageHero>
      <Section>
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <Eyebrow>Routes</Eyebrow>
            <div className="space-y-4">
              <Card title="Media">Interview and commentary requests.</Card>
              <Card title="Academic and institutional">Lectures, programmes and collaborations. For speaking dates, use the <a className="text-gold-deep underline" href="/speaking">speaking form</a>.</Card>
              <Card title="Professional">Advisory requests. To request a session, use <a className="text-gold-deep underline" href="/consult">Consult</a>.</Card>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6"><EnquiryForm type="contact" /></div>
        </div>
      </Section>
    </>
  );
}
