"use client";

import { useState } from "react";
import { parseVideo } from "@/lib/video";

// Nothing is loaded from YouTube or Vimeo until the reader presses play.
export default function VideoEmbed({ url }: { url: string }) {
  const [on, setOn] = useState(false);
  const v = parseVideo(url);
  if (!v) return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
  if (v.kind === "file") {
    return (
      <span className="block my-6">
        <video controls playsInline preload="metadata" src={v.src} className="w-full rounded-xl bg-black" />
      </span>
    );
  }
  const host = v.kind === "youtube" ? "YouTube" : "Vimeo";
  return (
    <span className="block my-6">
      <span className="block relative w-full overflow-hidden rounded-xl bg-navy-deep" style={{ aspectRatio: "16 / 9" }}>
        {on ? (
          <iframe
            src={v.embed + (v.kind === "vimeo" ? "?autoplay=1" : "")}
            title={`Video player (${host})`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl">▶</span>
            <span className="text-sm font-semibold">Play video</span>
            <span className="px-6 text-center text-xs text-white/70">Loads the {host} player when you press play</span>
          </button>
        )}
      </span>
      <span className="mt-2 block text-sm"><a href={v.watch} target="_blank" rel="noopener noreferrer">Watch on {host}</a></span>
    </span>
  );
}
