"use client";

import { useEffect, useState } from "react";

const btn = "inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy hover:border-gold no-underline";

export default function ShareBar({ url, title, lang = "en" }: { url: string; title: string; lang?: "en" | "hi" }) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"), []);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const hi = lang === "hi";
  const items = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
  return (
    <div className="mt-10 border-t border-line pt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-deep">{hi ? "साझा करें" : "Share this article"}</p>
      <div className="flex flex-wrap gap-2">
        {canShare ? (
          <button type="button" className={btn} onClick={() => navigator.share({ title, url }).catch(() => {})}>{hi ? "साझा करें" : "Share"}</button>
        ) : null}
        {items.map((i) => (
          <a key={i.label} href={i.href} target="_blank" rel="noopener noreferrer" className={btn} aria-label={`${i.label} (${hi ? "नए टैब में खुलेगा" : "opens in a new tab"})`}>{i.label}</a>
        ))}
        <button
          type="button"
          className={btn}
          onClick={() => navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {})}
        >
          {copied ? (hi ? "कॉपी हो गया" : "Link copied") : hi ? "लिंक कॉपी करें" : "Copy link"}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{copied ? "Link copied" : ""}</p>
    </div>
  );
}
