import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-[0.18em] uppercase text-gold-deep">
      <span className="inline-block w-6 h-px bg-gold" />
      {children}
    </p>
  );
}

export function Section({ children, tone = "plain", id }: { children: React.ReactNode; tone?: "plain" | "soft" | "gold"; id?: string }) {
  const bg = tone === "soft" ? "bg-paper-deep" : tone === "gold" ? "bg-gold-soft" : "bg-transparent";
  return (
    <section id={id} className={`${bg} px-5 sm:px-8 py-14 sm:py-20`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="px-5 sm:px-8 pt-14 sm:pt-20 pb-10 sm:pb-14 bg-gradient-to-b from-paper-deep to-paper">
      <div className="mx-auto max-w-4xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-serif text-4xl sm:text-6xl font-light leading-[1.05] tracking-tight text-navy-deep">{title}</h1>
        {children ? <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-body">{children}</p> : null}
      </div>
    </section>
  );
}

export function Button({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const cls =
    variant === "primary"
      ? "bg-navy text-white hover:bg-navy-deep"
      : "bg-white text-navy border border-line hover:border-gold";
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors no-underline ${cls}`}>
      {children}
    </Link>
  );
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="font-serif text-xl text-navy-deep mb-1.5">{title}</h3>
      <div className="text-sm leading-relaxed text-body">{children}</div>
    </div>
  );
}
