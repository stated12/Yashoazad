"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createUploadUrl, deleteArticle, publishArticle, saveArticle, unpublishArticle } from "@/app/author/actions";
import { TOPICS } from "@/lib/site";
import { slugify } from "@/lib/slug";
import { parseVideo } from "@/lib/video";
import { MAX_VIDEO_MB, type EditorArticle } from "@/lib/author-types";

type Lang = "en" | "hi";
type Msg = { kind: "ok" | "err"; text: string } | null;

const field = "w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink focus:border-gold focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink";
const tool = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-navy active:bg-paper-deep";
const bar = "min-h-12 rounded-lg px-4 text-sm font-semibold disabled:opacity-60";

const hasContent = (f: EditorArticle) => !!(f.title || f.title_hi || f.body || f.body_hi);

// Shrinks phone photos before upload so they are quick on mobile data.
async function compressImage(file: File): Promise<{ blob: Blob; name: string; type: string }> {
  try {
    if (file.type === "image/gif") return { blob: file, name: file.name, type: file.type };
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const max = 1920;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) throw new Error("not smaller");
    return { blob, name: file.name.replace(/\.[^.]+$/, "") + ".jpg", type: "image/jpeg" };
  } catch {
    return { blob: file, name: file.name, type: file.type };
  }
}

export default function Editor({ initial }: { initial: EditorArticle }) {
  const router = useRouter();
  const [f, setF] = useState<EditorArticle>(initial);
  const [tab, setTab] = useState<Lang>(initial.title_hi && !initial.title ? "hi" : "en");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(initial.updated_at);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);

  const fRef = useRef(f);
  fRef.current = f;
  const ver = useRef(0);
  const saving = useRef(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<EditorArticle>) => {
    ver.current++;
    setF((p) => ({ ...p, ...patch }));
    setDirty(true);
  };

  const live = f.status === "published";
  const key = (base: "title" | "summary" | "body" | "seo_title" | "seo_description") =>
    (tab === "hi" ? `${base}_hi` : base) as keyof EditorArticle;
  const val = (base: Parameters<typeof key>[0]) => f[key(base)] as string;

  // ---------- save ----------
  const save = useCallback(async (quiet = false): Promise<boolean> => {
    if (saving.current) return false;
    saving.current = true;
    if (!quiet) setBusy("save");
    const before = ver.current;
    try {
      const cur = fRef.current;
      const r = await saveArticle(cur);
      if (!r.ok) {
        setMsg({ kind: "err", text: r.error });
        return false;
      }
      setF((p) => ({ ...p, id: r.id, status: r.status, slug: p.slug === cur.slug ? r.slug : p.slug }));
      if (!cur.id) window.history.replaceState(null, "", `/author/${r.id}`);
      if (ver.current === before) setDirty(false);
      setSavedAt(r.updated_at);
      setMsg(quiet ? null : { kind: "ok", text: "Saved." });
      return true;
    } catch {
      setMsg({ kind: "err", text: "Could not save. Check your connection and try again. Your text is still here." });
      return false;
    } finally {
      saving.current = false;
      if (!quiet) setBusy(null);
    }
  }, []);

  // Drafts save themselves a few seconds after you stop typing. Live articles only save when you press Update.
  useEffect(() => {
    if (!dirty || live) return;
    const t = setTimeout(() => {
      if (hasContent(fRef.current)) save(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [f, dirty, live, savedAt, save]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // ---------- actions ----------
  async function onPublish() {
    if (!window.confirm(live ? "Save these changes to the live article?" : "Publish now? It will appear on the website.")) return;
    setBusy("publish");
    setMsg(null);
    if (!(await save(true))) {
      setBusy(null);
      return;
    }
    const id = fRef.current.id;
    if (!id) return setBusy(null);
    const r = await publishArticle(id);
    setBusy(null);
    if (!r.ok) return setMsg({ kind: "err", text: r.error });
    setF((p) => ({ ...p, status: "published" }));
    setDirty(false);
    setMsg({ kind: "ok", text: live ? "Updated. Changes are live." : (r.message ?? "Published.") });
  }

  async function onUnpublish() {
    const id = f.id;
    if (!id || !window.confirm("Take this article off the website? It becomes a private draft.")) return;
    setBusy("unpublish");
    const r = await unpublishArticle(id);
    setBusy(null);
    if (!r.ok) return setMsg({ kind: "err", text: r.error });
    setF((p) => ({ ...p, status: "draft" }));
    setMsg({ kind: "ok", text: r.message ?? "Unpublished." });
  }

  async function onDelete() {
    const id = f.id;
    if (!id) return router.push("/author");
    if (!window.confirm(`Delete "${f.title || f.title_hi || "this article"}" permanently? This cannot be undone.`)) return;
    setBusy("delete");
    const r = await deleteArticle(id);
    if (!r.ok) {
      setBusy(null);
      return setMsg({ kind: "err", text: r.error });
    }
    setDirty(false);
    window.location.assign("/author");
  }

  async function onPreview() {
    if (!hasContent(fRef.current)) return setMsg({ kind: "err", text: "Write something first." });
    setBusy("preview");
    const ok = !dirty && fRef.current.id ? true : await save(true);
    setBusy(null);
    if (ok && fRef.current.id) router.push(`/author/${fRef.current.id}/preview?lang=${tab}`);
  }

  // ---------- uploads ----------
  async function upload(file: File, kind: "image" | "video"): Promise<string | null> {
    setBusy("upload");
    setMsg({ kind: "ok", text: kind === "video" ? "Uploading video… keep this page open." : "Uploading photo…" });
    try {
      let blob: Blob = file;
      let name = file.name;
      let type = file.type;
      if (kind === "image") ({ blob, name, type } = await compressImage(file));
      const r = await createUploadUrl({ kind, name, type, size: blob.size });
      if (!r.ok) {
        setMsg({ kind: "err", text: r.error });
        return null;
      }
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await sb.storage.from(r.bucket).uploadToSignedUrl(r.path, r.token, blob, { contentType: type });
      if (error) {
        setMsg({ kind: "err", text: "Upload failed. Check your connection and try again." });
        return null;
      }
      setMsg({ kind: "ok", text: "Uploaded." });
      return r.publicUrl;
    } catch {
      setMsg({ kind: "err", text: "Upload failed. Check your connection and try again." });
      return null;
    } finally {
      setBusy(null);
    }
  }

  // ---------- text editing ----------
  function edit(fn: (v: string, s: number, e: number) => { v: string; s: number; e: number }) {
    const el = bodyRef.current;
    if (!el) return;
    const k = key("body");
    const r = fn(f[k] as string, el.selectionStart, el.selectionEnd);
    set({ [k]: r.v } as Partial<EditorArticle>);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(r.s, r.e);
    });
  }
  const wrap = (m: string, ph: string) =>
    edit((v, s, e) => {
      const sel = v.slice(s, e) || ph;
      return { v: v.slice(0, s) + m + sel + m + v.slice(e), s: s + m.length, e: s + m.length + sel.length };
    });
  const prefix = (p: string) =>
    edit((v, s, e) => {
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      return { v: v.slice(0, ls) + p + v.slice(ls), s: s + p.length, e: e + p.length };
    });
  const block = (text: string) =>
    edit((v, s, e) => {
      const ins = (s > 0 && !v.slice(0, s).endsWith("\n\n") ? (v.slice(0, s).endsWith("\n") ? "\n" : "\n\n") : "") + text + "\n\n";
      const pos = s + ins.length;
      return { v: v.slice(0, s) + ins + v.slice(e), s: pos, e: pos };
    });
  const addLink = () => {
    const url = window.prompt("Paste the link (https://…)");
    if (!url) return;
    edit((v, s, e) => {
      const text = v.slice(s, e) || "link text";
      const ins = `[${text}](${url.trim()})`;
      return { v: v.slice(0, s) + ins + v.slice(e), s: s + ins.length, e: s + ins.length };
    });
  };
  const addVideoLink = () => {
    const url = window.prompt("Paste the YouTube or Vimeo link");
    if (!url) return;
    if (!parseVideo(url)) return setMsg({ kind: "err", text: "That link is not a YouTube, Vimeo or direct video link (it must start with https://)." });
    block(`[video](${url.trim()})`);
  };
  async function onPhoto(file?: File) {
    if (!file) return;
    const caption = (window.prompt("Photo caption (optional, also used as the description for screen readers)") || "").replace(/["\]\[]/g, "'").trim();
    const url = await upload(file, "image");
    if (url) block(`![${caption || "Photograph"}](${url}${caption ? ` "${caption}"` : ""})`);
  }
  async function onVideoFile(file?: File) {
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return setMsg({ kind: "err", text: `This video is larger than ${MAX_VIDEO_MB} MB. Upload it to YouTube and use "Add YouTube link".` });
    }
    const url = await upload(file, "video");
    if (url) block(`[video](${url})`);
  }
  async function onCover(file?: File) {
    if (!file) return;
    const url = await upload(file, "image");
    if (url) set({ featured_image_url: url });
  }

  const onTitle = (v: string) => {
    const patch: Partial<EditorArticle> = { [key("title")]: v } as Partial<EditorArticle>;
    if (tab === "en" && !slugTouched && !live) patch.slug = slugify(v);
    set(patch);
  };

  const stamp = savedAt ? new Date(savedAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : null;
  const status = dirty ? "Unsaved changes" : stamp ? `Saved ${stamp}` : "Not saved yet";
  const working = busy !== null;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-40 pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/author" className="inline-flex min-h-11 items-center text-sm text-gold-deep underline" onClick={(e) => { if (dirty && !window.confirm("You have unsaved changes. Leave anyway?")) e.preventDefault(); }}>← All articles</Link>
        <p className="text-right text-xs text-muted" aria-live="polite">{live ? "Live · " : "Draft · "}{status}</p>
      </div>

      <div role="tablist" aria-label="Language" className="mb-4 grid grid-cols-2 gap-2">
        {(["en", "hi"] as const).map((l) => (
          <button key={l} role="tab" type="button" aria-selected={tab === l} onClick={() => setTab(l)}
            className={`min-h-12 rounded-lg border text-base font-semibold ${tab === l ? "border-navy bg-navy text-white" : "border-line bg-white text-body"}`}>
            {l === "en" ? "English" : "हिन्दी"}{(l === "en" ? f.title || f.body : f.title_hi || f.body_hi) ? " ✓" : ""}
          </button>
        ))}
      </div>
      <p className="mb-4 text-xs text-muted">Write in one language or both. Visitors see a language switch only when both are filled in.</p>

      <div lang={tab === "hi" ? "hi" : "en"} className="space-y-4">
        <div>
          <label htmlFor="title" className={label}>Title</label>
          <input id="title" value={val("title")} onChange={(e) => onTitle(e.target.value)} className={`${field} text-lg`} />
        </div>
        <div>
          <label htmlFor="summary" className={label}>Short summary <span className="font-normal text-muted">(shown in lists and when shared)</span></label>
          <textarea id="summary" rows={3} value={val("summary")} onChange={(e) => set({ [key("summary")]: e.target.value } as Partial<EditorArticle>)} className={field} />
        </div>

        <div>
          <label htmlFor="body" className={label}>Article</label>
          <div className="mb-2 flex flex-wrap gap-2" role="toolbar" aria-label="Formatting">
            <button type="button" className={tool} onClick={() => prefix("## ")}>Heading</button>
            <button type="button" className={`${tool} font-bold`} onClick={() => wrap("**", "bold text")}>B</button>
            <button type="button" className={`${tool} italic`} onClick={() => wrap("*", "italic text")}>I</button>
            <button type="button" className={tool} onClick={() => prefix("- ")}>List</button>
            <button type="button" className={tool} onClick={() => prefix("> ")}>Quote</button>
            <button type="button" className={tool} onClick={addLink}>Link</button>
          </div>
          <div className="mb-2 flex flex-wrap gap-2" role="toolbar" aria-label="Add media">
            <button type="button" className={tool} disabled={working} onClick={() => photoRef.current?.click()}>📷 Add photo</button>
            <button type="button" className={tool} onClick={addVideoLink}>▶ Add YouTube link</button>
            <button type="button" className={tool} disabled={working} onClick={() => videoRef.current?.click()}>⬆ Upload short video</button>
          </div>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => { onVideoFile(e.target.files?.[0]); e.target.value = ""; }} />
          <textarea id="body" ref={bodyRef} rows={16} value={val("body")} onChange={(e) => set({ [key("body")]: e.target.value } as Partial<EditorArticle>)}
            className={`${field} min-h-[50vh] leading-relaxed`} />
          <p className="mt-1 text-xs text-muted">Leave a blank line between paragraphs. Videos longer than a minute: upload to YouTube and use “Add YouTube link”.</p>
        </div>

        <details className="rounded-lg border border-line bg-white p-4">
          <summary className="min-h-11 cursor-pointer text-sm font-semibold text-navy">Search engine text ({tab === "hi" ? "हिन्दी" : "English"}) <span className="font-normal text-muted">optional</span></summary>
          <div className="mt-3 space-y-4">
            <div>
              <label htmlFor="seot" className={label}>SEO title <span className="font-normal text-muted">(up to 70 characters; blank uses the title)</span></label>
              <input id="seot" maxLength={70} value={val("seo_title")} onChange={(e) => set({ [key("seo_title")]: e.target.value } as Partial<EditorArticle>)} className={field} />
            </div>
            <div>
              <label htmlFor="seod" className={label}>SEO description <span className="font-normal text-muted">(up to 200; blank uses the summary)</span></label>
              <textarea id="seod" rows={3} maxLength={200} value={val("seo_description")} onChange={(e) => set({ [key("seo_description")]: e.target.value } as Partial<EditorArticle>)} className={field} />
            </div>
          </div>
        </details>
      </div>

      <div className="mt-8 space-y-4 border-t border-line pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-deep">For both languages</h2>
        <div>
          <label htmlFor="topic" className={label}>Category</label>
          <select id="topic" value={f.topic} onChange={(e) => set({ topic: e.target.value })} className={field}>
            <option value="">No category</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="access" className={label}>Who can read it</label>
          <select id="access" value={f.access} onChange={(e) => set({ access: e.target.value as "free" | "exclusive" })} className={field}>
            <option value="free">Everyone (free)</option>
            <option value="exclusive">Exclusive (subscribers, when memberships open)</option>
          </select>
        </div>

        <div>
          <span className={label}>Featured photo <span className="font-normal text-muted">(top of the article and when shared)</span></span>
          {f.featured_image_url ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.featured_image_url} alt="" className="w-full rounded-lg" />
              <div>
                <label htmlFor="alt" className={label}>Describe the photo</label>
                <input id="alt" value={f.featured_image_alt} onChange={(e) => set({ featured_image_alt: e.target.value })} className={field} />
              </div>
              <div className="flex gap-2">
                <button type="button" className={tool} disabled={working} onClick={() => coverRef.current?.click()}>Replace</button>
                <button type="button" className={tool} onClick={() => set({ featured_image_url: "", featured_image_alt: "" })}>Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" className={`${tool} w-full`} disabled={working} onClick={() => coverRef.current?.click()}>📷 Choose a photo</button>
          )}
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onCover(e.target.files?.[0]); e.target.value = ""; }} />
        </div>

        <details className="rounded-lg border border-line bg-white p-4">
          <summary className="min-h-11 cursor-pointer text-sm font-semibold text-navy">Web address (URL)</summary>
          <div className="mt-3">
            <label htmlFor="slug" className={label}>yashoazad.in/insights/…</label>
            <input id="slug" value={f.slug} autoCapitalize="none" autoCorrect="off" spellCheck={false}
              onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }} className={field} placeholder="short-english-address" />
            <p className="mt-1 text-xs text-muted">
              {live ? "This article is live. Changing the address breaks links already shared." : "Made from the English title. For a Hindi-only article, type a short English address, or leave it blank for an automatic one."}
            </p>
          </div>
        </details>

        {f.id ? (
          <button type="button" onClick={onDelete} disabled={working} className="min-h-11 text-sm text-red-700 underline">Delete this article</button>
        ) : null}
      </div>

      {msg ? (
        <p role={msg.kind === "err" ? "alert" : "status"} className={`mt-6 rounded-lg border p-3 text-sm ${msg.kind === "err" ? "border-red-300 bg-red-50 text-red-800" : "border-line bg-white text-body"}`}>
          {msg.text}
          {msg.kind === "ok" && live && f.slug ? <> <a className="font-semibold text-gold-deep underline" href={`/insights/${f.slug}`} target="_blank" rel="noopener noreferrer">View on website</a></> : null}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
          <button type="button" onClick={() => save()} disabled={working || !dirty} className={`${bar} flex-1 border border-line bg-white text-navy`}>{busy === "save" ? "Saving…" : live ? "Save only" : "Save draft"}</button>
          <button type="button" onClick={onPreview} disabled={working} className={`${bar} flex-1 border border-line bg-white text-navy`}>{busy === "preview" ? "Opening…" : "Preview"}</button>
          <button type="button" onClick={onPublish} disabled={working} className={`${bar} flex-1 bg-navy text-white`}>{busy === "publish" ? "Working…" : live ? "Update live" : "Publish"}</button>
          {live ? <button type="button" onClick={onUnpublish} disabled={working} className={`${bar} basis-full text-sm text-body underline`}>Unpublish (make private)</button> : null}
        </div>
      </div>
    </div>
  );
}
