import Image from "next/image";
import Link from "next/link";
import { BOOK, EXPERTISE, HIGHLIGHTS } from "@/lib/profile";
import { SITE } from "@/lib/site";
import { listArticles } from "@/lib/content";
import { Button, Card, Eyebrow, Section } from "@/components/ui";
import EnquiryForm from "@/components/EnquiryForm";

export const revalidate = 60;

export default async function Home() {
  const latest = await listArticles({ limit: 3 });

  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    image: SITE.url + "/yashovardhan-azad-portrait.jpg",
    jobTitle: "Former Special Director, Intelligence Bureau; Former Central Information Commissioner",
    author: { "@type": "Book", name: BOOK.title, publisher: { "@type": "Organization", name: BOOK.publisher } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-12 sm:pt-20 pb-14 sm:pb-24 bg-gradient-to-b from-paper-deep via-paper to-paper">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <Eyebrow>IPS (Retd.)</Eyebrow>
            <h1 className="font-serif text-5xl sm:text-7xl font-light leading-[1.02] tracking-tight text-navy-deep">
              Four Decades of Public Service.{" "}
              <em className="text-gold-deep">A Lifetime of Lessons.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-body">
              Yashovardhan Jha Azad, former Special Director of the Intelligence Bureau and former Central Information Commissioner, on policing, national security, governance and the public trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/insights">Explore His Insights</Button>
              <Button href="/speaking" variant="ghost">Invite Him to Speak</Button>
            </div>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <Link href="/learn" className="text-gold-deep hover:underline">Students &amp; Learning</Link>
              <Link href="/exclusive" className="text-gold-deep hover:underline">Subscribe for Exclusive Insights</Link>
              <Link href="/consult" className="text-gold-deep hover:underline">Book a consultation</Link>
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[1.75rem] border border-line bg-white p-3 shadow-[0_30px_60px_-30px_rgba(31,47,77,0.35)]">
              <Image src="/yashovardhan-azad-portrait.jpg" alt="Yashovardhan Jha Azad" width={922} height={1024} priority className="rounded-[1.25rem] w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="px-5 sm:px-8 pb-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="bg-white px-5 py-6">
              <p className="font-serif text-2xl sm:text-3xl text-navy-deep leading-tight">{h.value}</p>
              <p className="mt-1 text-xs leading-snug text-muted">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <Section>
        <Eyebrow>Areas of expertise</Eyebrow>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-navy-deep tracking-tight mb-8 max-w-2xl">Experience from inside the institutions.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERTISE.map((e) => (
            <Card key={e.title} title={e.title}>{e.body}</Card>
          ))}
        </div>
        <p className="mt-6"><Link href="/about" className="text-sm font-medium text-gold-deep hover:underline">Read the full profile and career timeline</Link></p>
      </Section>

      {/* BOOK */}
      <Section tone="soft">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] items-center">
          <div className="mx-auto w-full max-w-[280px]">
            <Image src={BOOK.cover} alt={`Cover of ${BOOK.title} by Yashovardhan Azad`} width={899} height={1400} className="w-full h-auto rounded-sm shadow-[0_24px_50px_-18px_rgba(31,47,77,0.45)]" />
          </div>
          <div>
            <Eyebrow>The book</Eyebrow>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-navy-deep tracking-tight">{BOOK.title}</h2>
            <p className="mt-3 text-base text-body leading-relaxed">{BOOK.subtitle}</p>
            <p className="mt-3 text-sm text-muted">{BOOK.foreword} · {BOOK.publisher}</p>
            <p className="mt-5 text-base leading-relaxed text-body">{BOOK.description[0]}</p>
            <div className="mt-6"><Button href="/books">About the book</Button></div>
          </div>
        </div>
      </Section>

      {/* LATEST ARTICLES (only when real articles exist) */}
      {latest.length > 0 ? (
        <Section>
          <Eyebrow>Latest insights</Eyebrow>
          <div className="grid md:grid-cols-3 gap-5">
            {latest.map((a) => (
              <Link key={a.id} href={`/insights/${a.slug}`} className="block rounded-xl border border-line bg-white p-5 hover:border-gold transition-colors no-underline">
                <p className="text-xs text-gold-deep font-medium mb-2">{a.access === "exclusive" ? "Exclusive" : a.topic || "Article"}</p>
                <h3 className="font-serif text-2xl text-navy-deep leading-snug">{a.title}</h3>
                <p className="mt-2 text-sm text-body line-clamp-3">{a.summary}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6"><Link href="/insights" className="text-sm font-medium text-gold-deep hover:underline">All insights</Link></p>
        </Section>
      ) : null}

      {/* ENTRY POINTS */}
      <Section tone={latest.length ? "soft" : "plain"}>
        <Eyebrow>Engage</Eyebrow>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Students & Learning", "Free reading and lectures, with masterclasses and workshops to follow.", "/learn", "For students"],
            ["Speaking & Institutions", "Lectures, panels and programmes for universities, conferences and organisations.", "/speaking", "Invite him to speak"],
            ["Consult", "Request a one-to-one session on governance, strategic risk, crisis preparedness or RTI.", "/consult", "Request a session"],
          ].map(([t, b, h, c]) => (
            <div key={t} className="rounded-2xl border border-line bg-white p-6 flex flex-col">
              <h3 className="font-serif text-2xl text-navy-deep">{t}</h3>
              <p className="mt-2 mb-5 text-sm leading-relaxed text-body">{b}</p>
              <Link href={h} className="mt-auto text-sm font-medium text-gold-deep hover:underline">{c} &rarr;</Link>
            </div>
          ))}
        </div>
      </Section>

      {/* EXCLUSIVE */}
      <Section tone="gold">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <Eyebrow>Exclusive Insights</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-navy-deep tracking-tight">Deeper analysis, for readers who want more.</h2>
            <p className="mt-4 text-base text-body leading-relaxed">Extended articles, reading notes and recorded discussions for subscribers, alongside a growing library of free public-interest writing.</p>
          </div>
          <div className="rounded-2xl bg-white border border-line p-6">
            <p className="text-sm font-medium text-navy-deep mb-3">Be the first to know when it opens</p>
            <EnquiryForm type="exclusive" />
          </div>
        </div>
      </Section>
    </>
  );
}
