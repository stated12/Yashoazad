export type ArticleStatus = "draft" | "published";

// What the editor holds and sends to the server.
export type EditorArticle = {
  id: string | null;
  slug: string;
  status: ArticleStatus;
  topic: string;
  access: "free" | "exclusive";
  title: string;
  summary: string;
  body: string;
  title_hi: string;
  summary_hi: string;
  body_hi: string;
  seo_title: string;
  seo_description: string;
  seo_title_hi: string;
  seo_description_hi: string;
  featured_image_url: string;
  featured_image_alt: string;
  updated_at: string | null;
};

export const EMPTY_ARTICLE: EditorArticle = {
  id: null, slug: "", status: "draft", topic: "", access: "free",
  title: "", summary: "", body: "", title_hi: "", summary_hi: "", body_hi: "",
  seo_title: "", seo_description: "", seo_title_hi: "", seo_description_hi: "",
  featured_image_url: "", featured_image_alt: "", updated_at: null,
};

export type SaveResult =
  | { ok: true; id: string; slug: string; status: ArticleStatus; updated_at: string }
  | { ok: false; error: string };

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export type UploadResult =
  | { ok: true; bucket: string; path: string; token: string; publicUrl: string }
  | { ok: false; error: string };

export const MAX_VIDEO_MB = 50;
export const MAX_IMAGE_MB = 10;
