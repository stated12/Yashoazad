import { db } from "./supabase";

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topic: string | null;
  access: "free" | "exclusive";
  published_at: string;
  body?: string;
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

const LIST = "id, slug, title, summary, topic, access, published_at";

export async function listArticles(opts: { q?: string; topic?: string; limit?: number } = {}): Promise<Article[]> {
  const c = db();
  if (!c) return [];
  try {
    let q = c.from("articles").select(LIST).eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
    if (opts.topic) q = q.eq("topic", opts.topic);
    if (opts.q) {
      const s = opts.q.replace(/[%,()]/g, " ").trim();
      if (s) q = q.or(`title.ilike.%${s}%,summary.ilike.%${s}%`);
    }
    const { data } = await q.limit(opts.limit ?? 50);
    return (data as unknown as Article[]) || [];
  } catch {
    return [];
  }
}

// The body of an exclusive article is only returned when `includeBody` is true.
export async function getArticle(slug: string, includeBody: boolean): Promise<Article | null> {
  const c = db();
  if (!c) return null;
  try {
    const { data } = await c
      .from("articles")
      .select(includeBody ? LIST + ", body" : LIST)
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    return (data as unknown as Article) || null;
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
