import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { Checklist, COLORS, display, PageHero, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { circleOfSecurity as c } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Circle of Security | Edu-Play Early Learning",
  description: c.intro,
};

export default function CircleOfSecurityPage() {
  return (
    <Shell>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} animal="kangaroo" />

      <Section bg={COLORS.cream} next={COLORS.sage}>
        <SectionHeading eyebrow="What is it?" title="A visual guide to secure attachment" />
        <Prose className="mt-6 max-w-3xl">
          <p>{c.what}</p>
        </Prose>
        <h3 className={`${display} mt-14 text-3xl`}>How can you use the Circle of Security?</h3>
        <ol className="mt-8 grid gap-6 md:grid-cols-2">
          {c.steps.map((s, i) => (
            <li key={s.title} data-reveal className="ink-card flex gap-5 rounded-3xl bg-[#fffdf8] p-6">
              <span className={`${display} flex size-11 shrink-0 items-center justify-center rounded-full border border-[#1b1714]/20 text-lg ${["bg-[#fbe3c4]", "bg-[#d9eadf]", "bg-[#f8dcd5]", "bg-[#d8e5ec]"][i % 4]}`}>{i + 1}</span>
              <div className="flex flex-col gap-3">
                <h4 className={`${display} text-2xl`}>{s.title}</h4>
                <Checklist items={s.items} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section bg={COLORS.sage}>
        <SectionHeading eyebrow="Resources" title="Learn more" center />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {c.resources.map((r) => (
            <a key={r.href} href={r.href} target="_blank" rel="noreferrer" data-reveal className="inline-flex items-center gap-2 rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#f3b46b]">
              {r.label} <ExternalLink className="size-3.5" />
            </a>
          ))}
        </div>
      </Section>

    </Shell>
  );
}
