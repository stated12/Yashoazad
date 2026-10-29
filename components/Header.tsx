"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-serif text-xl text-navy-deep no-underline" onClick={() => setOpen(false)}>
          {SITE.short}
        </Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="px-3 py-2 text-sm text-body hover:text-navy-deep no-underline">
              {n.label}
            </Link>
          ))}
          <Link href="/exclusive" className="ml-2 rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold-deep hover:bg-gold-soft no-underline">
            Exclusive Insights
          </Link>
        </nav>
        <button
          type="button"
          className="lg:hidden p-2 text-navy-deep"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>
      {open ? (
        <nav className="lg:hidden border-t border-line bg-paper px-5 py-3 flex flex-col" aria-label="Mobile">
          {[...NAV, { href: "/exclusive", label: "Exclusive Insights" }].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-base text-body border-b border-line/60 no-underline">
              {n.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
