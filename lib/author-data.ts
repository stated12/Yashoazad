import { db } from "./supabase";
import { EMPTY_ARTICLE, type EditorArticle } from "./author-types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const t = (v: unknown) => (typeof v === "string" ? v : "");

export type AuthorRow = EditorArticle & { published_at: string | null; created_at: string | null };

export function toEditor(r: Record<string, unknown>): AuthorRow {
  return {
    ...EMPTY_ARTICLE,
    id: String(r.id),
    slug: t(r.slug),
    status: r.status === "published" ? "published" : "draft",
    topic: t(r.topic),
    access: r.access === "exclusive" ? "exclusive" : "free",
    title: t(r.title), summary: t(r.summary), body: t(r.body),
    title_hi: t(r.title_hi), summary_hi: t(r.summary_hi), body_hi: t(r.body_hi),
    seo_title: t(r.seo_title), seo_description: t(r.seo_description),
    seo_title_hi: t(r.seo_title_hi), seo_description_hi: t(r.seo_description_hi),
    featured_image_url: t(r.featured_image_url), featured_image_alt: t(r.featured_image_alt),
    updated_at: typeof r.updated_at === "string" ? r.updated_at : null,
    published_at: typeof r.published_at === "string" ? r.published_at : null,
    created_at: typeof r.created_at === "string" ? r.created_at : null,
  };
}

export async function authorList(): Promise<{ rows: AuthorRow[]; error?: string }> {
  const c = db();
  if (!c) return { rows: [], error: "The database is not configured." };
  const { data, error } = await c.from("articles").select("*").order("updated_at", { ascending: false, nullsFirst: false }).limit(300);
  if (error) {
    // updated_at will not exist until 03_author.sql has been run: retry without ordering by it
    const r2 = await c.from("articles").select("*").order("created_at", { ascending: false }).limit(300);
    if (r2.error) return { rows: [], error: r2.error.message };
    return { rows: (r2.data as Record<string, unknown>[]).map(toEditor), error: "pending-sql" };
  }
  return { rows: (data as Record<string, unknown>[]).map(toEditor) };
}

export async function authorGet(id: string): Promise<AuthorRow | null> {
  if (!UUID.test(id)) return null;
  const c = db();
  if (!c) return null;
  const { data } = await c.from("articles").select("*").eq("id", id).maybeSingle();
  return data ? toEditor(data as Record<string, unknown>) : null;
}
