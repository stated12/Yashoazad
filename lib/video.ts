export type VideoSource =
  | { kind: "youtube"; id: string; watch: string; embed: string }
  | { kind: "vimeo"; id: string; watch: string; embed: string }
  | { kind: "file"; src: string }
  | null;

// Accepts YouTube, Vimeo and direct video file links. Anything else returns null.
export function parseVideo(raw: string): VideoSource {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return /^[\w-]{6,20}$/.test(id) ? yt(id) : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    let id = u.searchParams.get("v") || "";
    const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,20})/);
    if (!id && m) id = m[1];
    return /^[\w-]{6,20}$/.test(id) ? yt(id) : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(\d{5,12})/);
    if (m) return { kind: "vimeo", id: m[1], watch: `https://vimeo.com/${m[1]}`, embed: `https://player.vimeo.com/video/${m[1]}` };
    return null;
  }
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", src: u.toString() };
  return null;
}

function yt(id: string): VideoSource {
  return { kind: "youtube", id, watch: `https://www.youtube.com/watch?v=${id}`, embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
}
