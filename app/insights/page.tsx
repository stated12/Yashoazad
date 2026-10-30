import type { Metadata } from "next";
import Link from "next/link";
import { listArticles } from "@/lib/content";
import { TOPICS } from "@/lib/site";
import { PageHero, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Insights",
  description: "Articles and commentary on national security, intelligence, policing, governance, RTI, leadership and ethics.",
  alternates: { canonical: "/insights" },
};

export default async function Insights({ searchParams }: { searchParams: Promise<{ q?: string; topic?: string }> }) {
  const sp = await searchParams;
  const topic = TOPICS.includes(sp.topic || "") ? sp.topic : undefined;
  const articles = await listArticles({ q: sp.q, topic });
  const href = (t?: string) => (t ? `/insights?topic=${encodeURIComponent(t)}` : "/insights");

  return (
    <>
      <PageHero eyebrow="Knowledge & Insights" title="Writing and conversations on the public trust.">
        Commentary, explainers and long-form analysis. Public-interest writing stays free to read; some deeper pieces are for subscribers.
      </PageHero>
      <Section>
        <form action="/insights" className="flex gap-2 mb-5">
          {topic ? <input type="hidden" name="topic" value={topic} /> : null}
          <label htmlFor="q" className="sr-only">Search articles</label>
          <input id="q" name="q" defaultValue={sp.q || ""} placeholder="Search articles" className="flex-1 min-w-0 rounded-lg border border-line bg-white px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          <button type="submit" className="rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-deep">Search</button>
        </form>
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={href()} className={`rounded-full border px-3 py-1.5 text-xs ${!topic ? "border-navy bg-navy text-white" : "border-line text-body"}`}>All topics</Link>
          {TOPICS.map((t) => (
            <Link key={t} href={href(t)} className={`rounded-full border px-3 py-1.5 text-xs ${topic === t ? "border-navy bg-navy text-white" : "border-line text-body"}`}>{t}</Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-8 max-w-xl">
            <p className="font-serif text-2xl text-navy-deep mb-2">{sp.q || topic ? "No articles match." : "Articles are on their way."}</p>
            <p className="text-sm text-body mb-5">Leave your email and you will be told when new writing is published.</p>
            <EnquiryForm type="newsletter" compact />
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {articles.map((a) => {
              const hiOnly = a.langs.length === 1 && a.langs[0] === "hi";
              return (
                <Link key={a.id} href={`/insights/${a.slug}`} className="block overflow-hidden rounded-xl border border-line bg-white hover:border-gold transition-colors no-underline">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt="" loading="lazy" className="w-full object-cover" style={{ aspectRatio: "16 / 9" }} />
                  ) : null}
                  <div className="p-6" lang={hiOnly ? "hi" : undefined}>
                    <p className="text-xs font-medium text-gold-deep mb-2" lang="en">
                      {a.access === "exclusive" ? "Exclusive · " : ""}{a.topic || "Article"} · {new Date(a.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {a.langs.length > 1 ? " · English / हिन्दी" : hiOnly ? " · हिन्दी" : ""}
                    </p>
                    <h2 className="font-serif text-2xl text-navy-deep leading-snug">{a.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-body">{a.summary}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
