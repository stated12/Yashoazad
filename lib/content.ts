import { db } from "./supabase";

export type Lang = "en" | "hi";

export type Article = {
  id: string;
  slug: string;
  title: string;            // English title, or the Hindi title when the article is Hindi-only
  summary: string;
  topic: string | null;
  access: "free" | "exclusive";
  published_at: string;
  body?: string;
  // Added by the Author Publishing System. All optional so older rows and older code keep working.
  langs: Lang[];
  title_hi?: string | null;
  summary_hi?: string | null;
  body_hi?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_title_hi?: string | null;
  seo_description_hi?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  updated_at?: string | null;
};

export type MediaItem = {
  id: string;
  title: string;
  kind: string;
  source: string | null;
  url: string | null;
  summary: string | null;
  published_at: string | null;
};

const LEGACY = "id, slug, title, summary, topic, access, published_at";
const EXT = LEGACY + ", title_hi, summary_hi, seo_title, seo_description, seo_title_hi, seo_description_hi, featured_image_url, featured_image_alt, updated_at";

const s = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);

// Turns a database row (old or new shape) into an Article.
export function normalizeArticle(row: Record<string, unknown>): Article {
  const en = !!s(row.title);
  const hi = !!s(row.title_hi);
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: s(row.title) || s(row.title_hi) || "",
    summary: s(row.summary) || s(row.summary_hi) || "",
    topic: (row.topic as string | null) ?? null,
    access: row.access === "exclusive" ? "exclusive" : "free",
    published_at: String(row.published_at),
    body: typeof row.body === "string" ? row.body : undefined,
    langs: [...(en || !hi ? (["en"] as Lang[]) : []), ...(hi ? (["hi"] as Lang[]) : [])],
    title_hi: s(row.title_hi),
    summary_hi: s(row.summary_hi),
    body_hi: s(row.body_hi),
    seo_title: s(row.seo_title),
    seo_description: s(row.seo_description),
    seo_title_hi: s(row.seo_title_hi),
    seo_description_hi: s(row.seo_description_hi),
    image_url: s(row.featured_image_url),
    image_alt: s(row.featured_image_alt),
    updated_at: s(row.updated_at),
  };
}

export async function listArticles(opts: { q?: string; topic?: string; limit?: number } = {}): Promise<Article[]> {
  const c = db();
  if (!c) return [];
  const run = async (ext: boolean) => {
    let q = c
      .from("articles")
      .select(ext ? EXT : LEGACY)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (opts.topic) q = q.eq("topic", opts.topic);
    if (opts.q) {
      const t = opts.q.replace(/[%,()]/g, " ").trim();
      if (t) q = q.or(ext ? `title.ilike.%${t}%,summary.ilike.%${t}%,title_hi.ilike.%${t}%,summary_hi.ilike.%${t}%` : `title.ilike.%${t}%,summary.ilike.%${t}%`);
    }
    return q.limit(opts.limit ?? 50);
  };
  try {
    let { data, error } = await run(true);
    // If the author-system SQL has not been run yet, fall back to the original columns.
    if (error) ({ data, error } = await run(false));
    if (error || !data) return [];
    return (data as unknown as Record<string, unknown>[]).map(normalizeArticle);
  } catch {
    return [];
  }
}

// The body of an exclusive article is only returned when `includeBody` is true.
export async function getArticle(slug: string, includeBody: boolean): Promise<Article | null> {
  const c = db();
  if (!c) return null;
  const run = (ext: boolean) =>
    c
      .from("articles")
      .select((ext ? EXT : LEGACY) + (includeBody ? (ext ? ", body, body_hi" : ", body") : ""))
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
  try {
    let { data, error } = await run(true);
    if (error) ({ data, error } = await run(false));
    if (error || !data) return null;
    return normalizeArticle(data as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function listMedia(limit = 50): Promise<MediaItem[]> {
  const c = db();
  if (!c) return [];
  try {
    const { data } = await c
      .from("media_items")
      .select("id, title, kind, source, url, summary, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    return (data as unknown as MediaItem[]) || [];
  } catch {
    return [];
  }
}
