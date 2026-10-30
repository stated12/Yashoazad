import { SOCIALS } from "@/lib/site";

// Simple monochrome marks drawn as SVG. Each link has an accessible name and opens safely in a new tab.
const ICONS: Record<string, React.ReactNode> = {
  x: <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  linkedin: (
    <>
      <circle cx="7.5" cy="7.6" r="1.4" fill="currentColor" />
      <rect x="6.3" y="10.2" width="2.4" height="7.6" fill="currentColor" />
      <path d="M11 10.2h2.3v1.1c.5-.8 1.4-1.3 2.5-1.3 2 0 2.8 1.3 2.8 3.3v4.5h-2.4v-4c0-1-.3-1.7-1.3-1.7s-1.5.7-1.5 1.7v4H11z" fill="currentColor" />
    </>
  ),
  instagram: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.4" cy="7.7" r="1.1" fill="currentColor" />
    </>
  ),
  facebook: <path d="M13.5 20.5v-7.6h2.6l.4-3h-3V8.1c0-.9.3-1.5 1.5-1.5h1.6V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4v7.5z" fill="currentColor" />,
};

export default function SocialIcons() {
  return (
    <ul className="flex items-center gap-2" aria-label="Social profiles">
      {SOCIALS.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy hover:border-gold hover:text-gold-deep transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">{ICONS[s.id]}</svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
