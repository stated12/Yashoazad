import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import EnquiryForm from "./EnquiryForm";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep px-5 sm:px-8 py-14">
      <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-navy-deep">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted leading-relaxed">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[...NAV, { href: "/exclusive", label: "Exclusive Insights" }, { href: "/media", label: "Media" }].map((n) => (
            <Link key={n.href} href={n.href} className="text-body hover:text-navy-deep no-underline">{n.label}</Link>
          ))}
        </nav>
        <div>
          <p className="text-sm font-medium text-navy-deep mb-1">Occasional writing, by email</p>
          <p className="text-xs text-muted mb-3">New articles and announcements. No spam.</p>
          <EnquiryForm type="newsletter" compact />
        </div>
      </div>
      <p className="mx-auto max-w-5xl mt-10 pt-6 border-t border-line text-xs text-muted leading-relaxed">
        Views expressed on this website are personal. This website is independent and is not an official site of, and does not represent, the Government of India or any government body. Nothing here is legal advice or contains confidential or classified information.
      </p>
    </footer>
  );
}
