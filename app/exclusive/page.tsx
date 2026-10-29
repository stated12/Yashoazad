import type { Metadata } from "next";
import { listArticles } from "@/lib/content";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exclusive Insights",
  description: "Subscriber-only articles, extended analysis and recorded discussions by Yashovardhan Jha Azad.",
  alternates: { canonical: "/exclusive" },
};

export default async function Exclusive() {
  const all = await listArticles({ limit: 100 });
  const exclusive = all.filter((a) => a.access === "exclusive").slice(0, 6);
  return (
    <>
      <PageHero eyebrow="Exclusive Insights" title="Deeper analysis, for readers who want more.">
        A members' area for longer articles and recorded discussions. Free public-interest writing continues alongside it.
      </PageHero>
      <Section>
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          <Card title="In-depth articles">Extended analysis on security, policing, governance and transparency.</Card>
          <Card title="Reading notes and reflections">Curated reading notes and long-form reflections.</Card>
          <Card title="Recorded discussions">Selected recorded conversations and early access to approved new content.</Card>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>How it will work</Eyebrow>
            <ul className="space-y-3 text-sm leading-relaxed text-body">
              <li>Public articles stay free to read.</li>
              <li>Exclusive articles open to active subscribers after sign-in.</li>
              <li>Plans, prices and terms will be shown clearly before any payment.</li>
              <li>Cancellation and refund terms will be published before subscriptions open.</li>
            </ul>
            <p className="mt-6 text-sm text-muted">Subscriptions are not open yet. Register below to be told first.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="font-serif text-2xl text-navy-deep mb-4">Request early access</p>
            <EnquiryForm type="exclusive" />
          </div>
        </div>
      </Section>
      {exclusive.length > 0 ? (
        <Section tone="soft">
          <Eyebrow>Recent exclusive insights</Eyebrow>
          <div className="grid gap-4 md:grid-cols-2">
            {exclusive.map((a) => (
              <Link key={a.id} href={`/insights/${a.slug}`} className="block rounded-xl border border-line bg-white p-5 no-underline hover:border-gold">
                <h3 className="font-serif text-xl text-navy-deep">{a.title}</h3>
                <p className="mt-1 text-sm text-body">{a.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
