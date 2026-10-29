import type { Metadata } from "next";
import Image from "next/image";
import { BOOK } from "@/lib/profile";
import { Button, Eyebrow, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Policing the Republic",
  description: `${BOOK.title}: ${BOOK.subtitle}. ${BOOK.foreword}. Published by ${BOOK.publisher}.`,
  alternates: { canonical: "/books" },
  openGraph: { title: BOOK.title, description: BOOK.subtitle, images: [{ url: BOOK.cover, width: 899, height: 1400 }], type: "book" },
};

export default function Books() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: BOOK.title,
    alternativeHeadline: BOOK.subtitle,
    author: { "@type": "Person", name: "Yashovardhan Azad" },
    publisher: { "@type": "Organization", name: BOOK.publisher },
    image: BOOK.cover,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <Section>
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="mx-auto w-full max-w-[320px]">
            <Image src={BOOK.cover} alt={`Cover of ${BOOK.title}`} width={899} height={1400} priority className="w-full h-auto rounded-sm shadow-[0_28px_60px_-20px_rgba(31,47,77,0.5)]" />
          </div>
          <div>
            <Eyebrow>Book</Eyebrow>
            <h1 className="font-serif text-5xl sm:text-6xl font-light leading-tight tracking-tight text-navy-deep">{BOOK.title}</h1>
            <p className="mt-3 text-lg leading-relaxed text-body">{BOOK.subtitle}</p>
            <p className="mt-3 text-sm text-muted">{BOOK.foreword} · {BOOK.publisher}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-body">
              {BOOK.description.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-body"><span className="font-semibold text-navy-deep">Who it is for: </span>{BOOK.readers}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {BOOK.buyLinks.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep">{l.label}</a>
              ))}
              <Button href="/contact" variant="ghost">Institutional purchase or event enquiry</Button>
            </div>
            {BOOK.buyLinks.length === 0 ? <p className="mt-4 text-xs text-muted">Purchase links will be added from the publisher once confirmed.</p> : null}
          </div>
        </div>
      </Section>
    </>
  );
}
