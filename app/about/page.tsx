import type { Metadata } from "next";
import Image from "next/image";
import { BIO, COMMUNITY, EXPERTISE, HONOURS, SHOW_SENSITIVE_DETAILS, TIMELINE } from "@/lib/profile";
import { Card, Eyebrow, PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "About and Career",
  description: "Career, expertise, honours and public contributions of Yashovardhan Jha Azad, IPS (Retd.).",
  alternates: { canonical: "/about" },
};

export default function About() {
  const timeline = TIMELINE.filter((t) => SHOW_SENSITIVE_DETAILS || !t.sensitive);
  return (
    <>
      <PageHero eyebrow="About" title="A career in policing, intelligence and governance.">
        Nearly four decades of public service, from district policing to the Intelligence Bureau, the Cabinet Secretariat and the Central Information Commission.
      </PageHero>

      <Section>
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-xs">
            <div className="rounded-2xl border border-line bg-white p-2.5">
              <Image src="/yashovardhan-azad-portrait.jpg" alt="Yashovardhan Jha Azad" width={922} height={1024} className="rounded-xl w-full h-auto" />
            </div>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-body">
            {BIO.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <Eyebrow>Career timeline</Eyebrow>
        <ol className="relative border-l border-gold/50 ml-2 space-y-8">
          {timeline.map((t) => (
            <li key={t.title} className="pl-6">
              <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">{t.year}</p>
              <h3 className="font-serif text-2xl text-navy-deep">{t.title}</h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-body">{t.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Eyebrow>Areas of expertise</Eyebrow>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERTISE.map((e) => <Card key={e.title} title={e.title}>{e.body}</Card>)}
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Recognitions</Eyebrow>
            <div className="space-y-4">{HONOURS.map((h) => <Card key={h.title} title={h.title}>{h.body}</Card>)}</div>
          </div>
          <div>
            <Eyebrow>Community and patronage</Eyebrow>
            <div className="space-y-4">{COMMUNITY.map((h) => <Card key={h.title} title={h.title}>{h.body}</Card>)}</div>
          </div>
        </div>
      </Section>
    </>
  );
}
