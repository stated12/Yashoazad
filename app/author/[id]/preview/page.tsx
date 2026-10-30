import { notFound, redirect } from "next/navigation";
import { currentAuthor } from "@/lib/author-auth";
import { authorGet } from "@/lib/author-data";
import { normalizeArticle } from "@/lib/content";
import { ArticleView } from "@/components/ArticlePage";

export const dynamic = "force-dynamic";

export default async function Preview({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }> }) {
  if (!(await currentAuthor())) redirect("/author");
  const { id } = await params;
  const sp = await searchParams;
  const r = await authorGet(id);
  if (!r) notFound();

  const a = normalizeArticle({
    ...r,
    featured_image_url: r.featured_image_url,
    published_at: r.published_at || new Date().toISOString(),
    slug: r.slug || "preview",
  });
  if (!a.langs.length) notFound();
  const lang = sp.lang === "hi" && a.langs.includes("hi") ? "hi" : a.langs.includes("en") ? "en" : "hi";
  return (
    <ArticleView
      a={a}
      body={lang === "hi" ? r.body_hi : r.body}
      lang={lang}
      preview={{ editHref: `/author/${id}`, note: r.status === "published" ? "This is how the live article looks." : "This article is a draft and is not visible to visitors." }}
    />
  );
}
