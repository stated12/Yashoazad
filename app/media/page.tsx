import type { Metadata } from "next";
import { listMedia } from "@/lib/content";
import { PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Media and Talks",
  description: "Interviews, talks, speeches and public conversations featuring Yashovardhan Jha Azad.",
  alternates: { canonical: "/media" },
};

export const revalidate = 60;

export default async function Media() {
  const items = await listMedia();
  return (
    <>
      <PageHero eyebrow="Media" title="Interviews, talks and public conversations." />
      <Section>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-8 max-w-xl">
            <p className="font-serif text-2xl text-navy-deep mb-2">Media will be listed here soon.</p>
            <p className="text-sm text-body mb-5">Leave your email to hear when new interviews and talks are added.</p>
            <EnquiryForm type="newsletter" compact />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((m) => (
              <div key={m.id} className="rounded-xl border border-line bg-white p-5">
                <p className="text-xs font-medium text-gold-deep mb-1">{m.kind}{m.source ? ` · ${m.source}` : ""}{m.published_at ? ` · ${new Date(m.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : ""}</p>
                <h2 className="font-serif text-xl text-navy-deep">{m.title}</h2>
                {m.summary ? <p className="mt-1 text-sm text-body">{m.summary}</p> : null}
                {m.url ? <a href={m.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-gold-deep hover:underline">Watch or read</a> : null}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
