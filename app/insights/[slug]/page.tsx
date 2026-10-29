import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getArticle } from "@/lib/content";
import { hasExclusiveAccess } from "@/lib/entitlement";
import { SITE } from "@/lib/site";
import EnquiryForm from "@/components/EnquiryForm";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug, false);
  if (!a) return { title: "Article not found" };
  return {
    title: a.title,
    description: a.summary,
    alternates: { canonical: `/insights/${a.slug}` },
    openGraph: { title: a.title, description: a.summary, type: "article", publishedTime: a.published_at },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = await getArticle(slug, false);
  if (!meta) notFound();

  // The article body is fetched only when the reader is entitled to it.
  const entitled = meta.access === "free" || (await hasExclusiveAccess());
  const full = entitled ? await getArticle(slug, true) : null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.summary,
    datePublished: meta.published_at,
    author: { "@type": "Person", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/insights/${meta.slug}`,
    ...(meta.access === "exclusive" ? { isAccessibleForFree: false } : {}),
  };

  return (
    <article className="px-5 sm:px-8 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-2xl">
        <p className="text-xs text-muted mb-6"><Link href="/insights" className="hover:underline">Insights</Link>{meta.topic ? ` / ${meta.topic}` : ""}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          {meta.access === "exclusive" ? "Exclusive Insight" : "Article"} · {new Date(meta.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-light leading-tight text-navy-deep">{meta.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">{meta.summary}</p>
        <p className="mt-3 text-sm text-muted">By {SITE.name}</p>
        <hr className="my-8 border-line" />

        {full?.body ? (
          <div className="prose-article text-base"><ReactMarkdown>{full.body}</ReactMarkdown></div>
        ) : (
          <div className="rounded-2xl border border-gold/40 bg-gold-soft p-6">
            <p className="font-serif text-2xl text-navy-deep">This is an Exclusive Insight.</p>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Exclusive articles are for subscribers. Subscriptions are not open yet. Leave your details and you will be told as soon as they are.
            </p>
            <div className="mt-5 bg-white rounded-xl border border-line p-5"><EnquiryForm type="exclusive" /></div>
          </div>
        )}
        <p className="mt-10 text-xs text-muted">Views are personal and do not represent the Government of India.</p>
      </div>
    </article>
  );
}
