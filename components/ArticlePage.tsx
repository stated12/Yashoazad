import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getArticle, type Article, type Lang } from "@/lib/content";
import { hasExclusiveAccess } from "@/lib/entitlement";
import { SITE } from "@/lib/site";
import EnquiryForm from "./EnquiryForm";
import ArticleMarkdown from "./ArticleMarkdown";
import ShareBar from "./ShareBar";

const path = (slug: string, lang: Lang) => `/insights/${slug}${lang === "hi" ? "/hi" : ""}`;

export async function articleMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const a = await getArticle(slug, false);
  if (!a || !a.langs.includes(lang)) return { title: "Article not found" };
  const hi = lang === "hi";
  const title = (hi ? a.seo_title_hi || a.title_hi : a.seo_title || a.title) || a.title;
  const description = (hi ? a.seo_description_hi || a.summary_hi : a.seo_description || a.summary) || a.summary;
  const languages: Record<string, string> = {};
  for (const l of a.langs) languages[l] = path(slug, l);
  return {
    title,
    description,
    alternates: { canonical: path(slug, lang), languages },
    openGraph: {
      title, description, type: "article", publishedTime: a.published_at, locale: hi ? "hi_IN" : "en_IN",
      ...(a.image_url ? { images: [{ url: a.image_url, alt: a.image_alt || title }] } : {}),
    },
    twitter: { card: a.image_url ? "summary_large_image" : "summary", title, description, ...(a.image_url ? { images: [a.image_url] } : {}) },
  };
}

export async function ArticlePage({ slug, lang }: { slug: string; lang: Lang }) {
  const meta = await getArticle(slug, false);
  if (!meta) notFound();
  if (!meta.langs.includes(lang)) {
    if (meta.langs.length) redirect(path(slug, meta.langs[0]));
    notFound();
  }
  // The article body is fetched only when the reader is entitled to it.
  const entitled = meta.access === "free" || (await hasExclusiveAccess());
  const full = entitled ? await getArticle(slug, true) : null;
  return <ArticleView a={meta} body={lang === "hi" ? full?.body_hi : full?.body} lang={lang} />;
}

// Used by the public pages and by the author's preview.
export function ArticleView({ a, body, lang, preview }: { a: Article; body?: string | null; lang: Lang; preview?: { editHref: string; note: string } }) {
  const hi = lang === "hi";
  const title = (hi ? a.title_hi : a.title) || a.title;
  const summary = (hi ? a.summary_hi : a.summary) || a.summary;
  const url = `${SITE.url}${path(a.slug, lang)}`;
  const date = new Date(a.published_at).toLocaleDateString(hi ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: summary,
    inLanguage: hi ? "hi" : "en",
    datePublished: a.published_at,
    ...(a.updated_at ? { dateModified: a.updated_at } : {}),
    ...(a.image_url ? { image: [a.image_url] } : {}),
    author: { "@type": "Person", name: SITE.name },
    mainEntityOfPage: url,
    ...(a.access === "exclusive" ? { isAccessibleForFree: false } : {}),
  };

  return (
    <article className="px-5 sm:px-8 py-12 sm:py-16" lang={hi ? "hi" : "en"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-2xl">
        {preview ? (
          <div role="note" className="mb-6 rounded-lg border border-gold/50 bg-gold-soft px-4 py-3 text-sm text-ink" lang="en">
            <strong>Preview.</strong> {preview.note} <Link href={preview.editHref} className="font-semibold text-gold-deep underline">Back to editing</Link>
          </div>
        ) : null}
        <p className="mb-4 text-xs text-muted">
          <Link href="/insights" className="hover:underline">{hi ? "इनसाइट्स" : "Insights"}</Link>{a.topic ? ` / ${a.topic}` : ""}
        </p>
        {a.langs.length > 1 ? (
          <nav aria-label="Language" className="mb-5 flex gap-2 text-sm">
            <Link href={path(a.slug, "en")} lang="en" hrefLang="en" aria-current={!hi ? "page" : undefined} className={`inline-flex min-h-10 items-center rounded-full border px-4 no-underline ${!hi ? "border-navy bg-navy text-white" : "border-line text-body"}`}>English</Link>
            <Link href={path(a.slug, "hi")} lang="hi" hrefLang="hi" aria-current={hi ? "page" : undefined} className={`inline-flex min-h-10 items-center rounded-full border px-4 no-underline ${hi ? "border-navy bg-navy text-white" : "border-line text-body"}`}>हिन्दी</Link>
          </nav>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
          {a.access === "exclusive" ? (hi ? "एक्सक्लूसिव इनसाइट" : "Exclusive Insight") : hi ? "लेख" : "Article"} · {date}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light leading-tight text-navy-deep sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">{summary}</p>
        <p className="mt-3 text-sm text-muted">{hi ? "लेखक: यशोवर्धन झा आज़ाद" : `By ${SITE.name}`}</p>
        {a.image_url ? (
          <figure className="mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image_url} alt={a.image_alt || ""} className="w-full rounded-xl" />
          </figure>
        ) : null}
        <hr className="my-8 border-line" />

        {body ? (
          <div className="prose-article text-base"><ArticleMarkdown>{body}</ArticleMarkdown></div>
        ) : (
          <div className="rounded-2xl border border-gold/40 bg-gold-soft p-6" lang="en">
            <p className="font-serif text-2xl text-navy-deep">This is an Exclusive Insight.</p>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Exclusive articles are for subscribers. Subscriptions are not open yet. Leave your details and you will be told as soon as they are.
            </p>
            <div className="mt-5 rounded-xl border border-line bg-white p-5"><EnquiryForm type="exclusive" /></div>
          </div>
        )}

        {!preview ? <ShareBar url={url} title={title} lang={lang} /> : null}
        <p className="mt-10 text-xs text-muted">
          {hi ? "ये विचार व्यक्तिगत हैं और भारत सरकार का प्रतिनिधित्व नहीं करते।" : "Views are personal and do not represent the Government of India."}
        </p>
      </div>
    </article>
  );
}
