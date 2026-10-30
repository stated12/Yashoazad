import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Eyebrow } from "./ui";

export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <section className="px-5 sm:px-8 pt-14 sm:pt-20 pb-8 bg-gradient-to-b from-paper-deep to-paper">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl sm:text-5xl font-light leading-tight tracking-tight text-navy-deep">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-body">{intro}</p>
          <p className="mt-3 text-xs text-muted">Last updated: {LEGAL.updated}</p>
          {LEGAL.status === "draft" ? (
            <p role="note" className="mt-5 rounded-lg border border-gold/50 bg-gold-soft px-4 py-3 text-sm leading-relaxed text-ink">
              <strong>Draft.</strong> This page is awaiting final confirmation of the details highlighted below and has not yet been reviewed by a lawyer.
            </p>
          ) : null}
        </div>
      </section>
      <div className="px-5 sm:px-8 pb-20">
        <div className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-body">{children}</div>
        <nav aria-label="Other legal pages" className="mx-auto max-w-3xl mt-12 pt-6 border-t border-line flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link href="/privacy" className="text-gold-deep hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-gold-deep hover:underline">Terms of Use</Link>
          <Link href="/cookies" className="text-gold-deep hover:underline">Cookie Policy</Link>
          <Link href="/refunds" className="text-gold-deep hover:underline">Refund &amp; Cancellation</Link>
        </nav>
      </div>
    </>
  );
}

export function H({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-6 font-serif text-2xl sm:text-3xl text-navy-deep">{children}</h2>;
}

// Inline highlighted placeholder. Renders nothing once flags are switched off.
export function Confirm({ children }: { children: React.ReactNode }) {
  if (!LEGAL.showFlags) return null;
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 text-sm text-ink">
      [To confirm: {children}]
    </mark>
  );
}

// Shows a confirmed value, or a flagged placeholder while it is still unknown.
export function Value({ v, label }: { v: string | null; label: string }) {
  return v ? <>{v}</> : <Confirm>{label}</Confirm>;
}

export const noindexWhileDraft = () => ({ index: LEGAL.status === "approved", follow: true });
