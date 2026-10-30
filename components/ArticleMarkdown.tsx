import ReactMarkdown from "react-markdown";
import VideoEmbed from "./VideoEmbed";

// Markdown for articles. Photos: ![caption](url). Videos: a line containing only [video](link).
export default function ArticleMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p({ node, children }) {
          const kids = node?.children ?? [];
          if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "a") {
            const a = kids[0];
            const first = a.children[0];
            const label = first && first.type === "text" ? first.value.trim().toLowerCase() : "";
            const href = typeof a.properties?.href === "string" ? a.properties.href : "";
            if (label === "video" && href) return <VideoEmbed url={href} />;
          }
          return <p>{children}</p>;
        },
        img({ src, alt, title }) {
          if (typeof src !== "string") return null;
          return (
            <span className="block my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt || ""} loading="lazy" className="w-full rounded-xl" />
              {title ? <span className="mt-2 block text-sm text-muted">{title}</span> : null}
            </span>
          );
        },
        a({ href, children }) {
          const ext = typeof href === "string" && /^https?:\/\//.test(href);
          return <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
