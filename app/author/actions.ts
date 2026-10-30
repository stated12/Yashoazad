"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";
import { SITE, TOPICS } from "@/lib/site";
import { slugify } from "@/lib/slug";
import { authConfigured, authorEmail, currentAuthor, endSession, startSession } from "@/lib/author-auth";
import { MAX_IMAGE_MB, MAX_VIDEO_MB, type ActionResult, type EditorArticle, type SaveResult, type UploadResult } from "@/lib/author-types";

const BUCKET = "article-media";
const SETUP_HINT = "The database has not been updated yet. Run 03_author.sql in Supabase, then try again.";

// ---------- sign in ----------
export type LoginState = { ok: boolean; error?: string; email?: string };

function authClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requestCode(_prev: LoginState, fd: FormData): Promise<LoginState> {
  if (!authConfigured()) return { ok: false, error: "Sign-in is not set up yet. See docs/AUTHOR_SETUP.md." };
  const email = String(fd.get("email") || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  // Only the author's address ever receives a link. Other addresses get the same reply.
  if (email === authorEmail()) {
    const { error } = await authClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${SITE.url}/author/callback` },
    });
    if (error) return { ok: false, error: "Could not send the sign-in link just now. Wait a minute and try again." };
  }
  return { ok: true, email };
}

// Called by /author/callback with the access token from the magic link. Supabase confirms the
// token is genuine; the site then issues its own signed cookie, only for the author's address.
export async function completeSignIn(accessToken: string): Promise<{ ok: boolean; error?: string }> {
  if (!authConfigured()) return { ok: false, error: "Sign-in is not set up yet." };
  if (typeof accessToken !== "string" || accessToken.length < 20 || accessToken.length > 4096) return { ok: false, error: "This sign-in link is not valid." };
  const { data, error } = await authClient().auth.getUser(accessToken);
  if (error || data.user?.email?.toLowerCase() !== authorEmail()) return { ok: false, error: "This sign-in link is not valid or has expired." };
  await startSession(authorEmail());
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/author");
}

// ---------- helpers ----------
function clip(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "";
}
const nul = (v: string) => (v ? v : null);

function paths(slug: string): string[] {
  return ["/", "/insights", `/insights/${slug}`, `/insights/${slug}/hi`, "/exclusive", "/sitemap.xml"];
}
function refresh(...slugs: (string | null | undefined)[]) {
  const set = new Set<string>();
  for (const sl of slugs) if (sl) paths(sl).forEach((p) => set.add(p));
  set.forEach((p) => revalidatePath(p));
}

function setupError(msg: string): string {
  return /column|null value|constraint|does not exist/i.test(msg) ? SETUP_HINT : "Could not save: " + msg;
}

// A language counts as present if any of its fields is filled; then all three are required to publish.
function publishProblem(r: { title: string; summary: string; body: string; title_hi: string; summary_hi: string; body_hi: string; slug: string }): string | null {
  const en = !!(r.title || r.summary || r.body);
  const hi = !!(r.title_hi || r.summary_hi || r.body_hi);
  if (!en && !hi) return "Write a title and the article first.";
  if (en) {
    if (!r.title) return "English: add a title.";
    if (!r.summary) return "English: add a short summary.";
    if (!r.body) return "English: write the article text.";
  }
  if (hi) {
    if (!r.title_hi) return "हिन्दी: add a title.";
    if (!r.summary_hi) return "हिन्दी: add a short summary.";
    if (!r.body_hi) return "हिन्दी: write the article text.";
  }
  if (!r.slug) return "Add a web address (URL) under the URL section.";
  return null;
}

// ---------- save ----------
type ExistingRow = { status: string; slug: string; published_at: string | null };

export async function saveArticle(input: EditorArticle): Promise<SaveResult> {
  if (!(await currentAuthor())) return { ok: false, error: "You have been signed out. Reload the page and sign in again. Your text is still on this screen." };
  const c = db();
  if (!c) return { ok: false, error: "The database is not configured." };

  const row = {
    title: clip(input.title, 200), summary: clip(input.summary, 600), body: clip(input.body, 200_000),
    title_hi: clip(input.title_hi, 200), summary_hi: clip(input.summary_hi, 600), body_hi: clip(input.body_hi, 200_000),
    seo_title: clip(input.seo_title, 70), seo_description: clip(input.seo_description, 200),
    seo_title_hi: clip(input.seo_title_hi, 70), seo_description_hi: clip(input.seo_description_hi, 200),
    featured_image_url: clip(input.featured_image_url, 600), featured_image_alt: clip(input.featured_image_alt, 200),
  };
  if (!row.title && !row.title_hi && !row.body && !row.body_hi) return { ok: false, error: "Add a title first." };
  if (row.featured_image_url && !/^https:\/\//.test(row.featured_image_url)) return { ok: false, error: "The featured image link is not valid." };

  const topic = TOPICS.includes(input.topic) ? input.topic : null;
  const access = input.access === "exclusive" ? "exclusive" : "free";
  const userSlug = slugify(clip(input.slug, 120));
  const id = input.id || null;

  let existing: ExistingRow | null = null;
  if (id) {
    const { data, error } = await c.from("articles").select("status, slug, published_at").eq("id", id).maybeSingle();
    if (error) return { ok: false, error: setupError(error.message) };
    if (!data) return { ok: false, error: "This article no longer exists." };
    existing = data as ExistingRow;
  }

  let slug = userSlug || existing?.slug || slugify(row.title) || "article-" + Date.now().toString(36);
  if (existing?.status === "published") {
    const problem = publishProblem({ ...row, slug });
    if (problem) return { ok: false, error: problem + " (This article is live, so every language you started must be complete.)" };
  }

  const payload = {
    ...Object.fromEntries(Object.entries(row).map(([k, v]) => [k, nul(v as string)])),
    topic, access, updated_at: new Date().toISOString(),
  };
  const fields = "id, slug, status, updated_at";

  for (let attempt = 0; attempt < 2; attempt++) {
    const q = id
      ? c.from("articles").update({ ...payload, slug }).eq("id", id).select(fields).single()
      : c.from("articles").insert({ ...payload, slug, status: "draft" }).select(fields).single();
    const { data, error } = await q;
    if (!error && data) {
      const d = data as { id: string; slug: string; status: "draft" | "published"; updated_at: string };
      if (existing?.status === "published") refresh(existing.slug, d.slug);
      return { ok: true, id: d.id, slug: d.slug, status: d.status, updated_at: d.updated_at };
    }
    if (error?.code === "23505") {
      if (userSlug) return { ok: false, error: "That web address is already used by another article. Choose a different one." };
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      continue;
    }
    return { ok: false, error: setupError(error?.message || "unknown error") };
  }
  return { ok: false, error: "Could not create a unique web address. Edit it under the URL section." };
}

// ---------- publish / unpublish / delete ----------
export async function publishArticle(id: string): Promise<ActionResult> {
  if (!(await currentAuthor())) return { ok: false, error: "You have been signed out. Reload and sign in again." };
  const c = db();
  if (!c) return { ok: false, error: "The database is not configured." };
  const { data, error } = await c.from("articles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return { ok: false, error: "Article not found." };
  const r = data as Record<string, string | null>;
  const problem = publishProblem({
    title: r.title || "", summary: r.summary || "", body: r.body || "",
    title_hi: r.title_hi || "", summary_hi: r.summary_hi || "", body_hi: r.body_hi || "", slug: r.slug || "",
  });
  if (problem) return { ok: false, error: problem };
  const wasLive = r.status === "published";
  const { error: e2 } = await c
    .from("articles")
    .update({ status: "published", published_at: wasLive ? r.published_at : new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (e2) return { ok: false, error: setupError(e2.message) };
  refresh(r.slug);
  return { ok: true, message: "Published. It is now on the website." };
}

export async function unpublishArticle(id: string): Promise<ActionResult> {
  if (!(await currentAuthor())) return { ok: false, error: "You have been signed out. Reload and sign in again." };
  const c = db();
  if (!c) return { ok: false, error: "The database is not configured." };
  const { data } = await c.from("articles").select("slug").eq("id", id).maybeSingle();
  const { error } = await c.from("articles").update({ status: "draft", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { ok: false, error: setupError(error.message) };
  refresh((data as { slug?: string } | null)?.slug);
  return { ok: true, message: "Unpublished. It is now a private draft." };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  if (!(await currentAuthor())) return { ok: false, error: "You have been signed out. Reload and sign in again." };
  const c = db();
  if (!c) return { ok: false, error: "The database is not configured." };
  const { data } = await c.from("articles").select("slug").eq("id", id).maybeSingle();
  const { error } = await c.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: "Could not delete: " + error.message };
  refresh((data as { slug?: string } | null)?.slug);
  return { ok: true, message: "Deleted." };
}

// ---------- media upload ----------
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const VIDEO_TYPES: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };

export async function createUploadUrl(input: { kind: "image" | "video"; name: string; type: string; size: number }): Promise<UploadResult> {
  if (!(await currentAuthor())) return { ok: false, error: "You have been signed out. Reload and sign in again." };
  const c = db();
  if (!c) return { ok: false, error: "The database is not configured." };
  const table = input.kind === "video" ? VIDEO_TYPES : IMAGE_TYPES;
  const ext = table[input.type];
  if (!ext) return { ok: false, error: input.kind === "video" ? "Use an MP4, WebM or MOV video." : "Use a JPG, PNG, WebP or GIF image." };
  const limit = (input.kind === "video" ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;
  if (!(input.size > 0) || input.size > limit) {
    return { ok: false, error: input.kind === "video" ? `Videos can be up to ${MAX_VIDEO_MB} MB here. For longer videos, upload to YouTube and paste the link.` : `Images can be up to ${MAX_IMAGE_MB} MB.` };
  }
  const now = new Date();
  const base = slugify(input.name.replace(/\.[^.]+$/, "")) || input.kind;
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${Math.random().toString(36).slice(2, 8)}-${base}.${ext}`;
  const { data, error } = await c.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "Could not start the upload. Has 03_author.sql been run (it creates the storage bucket)?" };
  const publicUrl = c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return { ok: true, bucket: BUCKET, path: data.path, token: data.token, publicUrl };
}
