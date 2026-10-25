import type { Metadata } from "next";
import Image from "next/image";

import { Checklist, COLORS, display, IllustratedTile, PageHero, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { beachKinder as b } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Beach Kinder | Edu-Play Early Learning",
  description: b.intro,
};

export default function BeachKinderPage() {
  return (
    <Shell>
      <PageHero eyebrow="Weekly excursion" title={b.title} intro={b.intro} animal="platypus" />

      <Section bg={COLORS.cream} next={COLORS.white}>
        <SectionHeading eyebrow="How your child benefits" title="Learning by the sea" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {b.benefits.map((g, i) => (
            <div key={g.title} data-reveal className={`ink-card flex flex-col gap-4 rounded-3xl p-6 ${["bg-[#fffdf8]", "bg-[#dbe9de]", "bg-[#fffdf8]"][i]}`}>
              <h3 className={`${display} text-2xl`}>
                <span className="mr-2 opacity-50">{i + 1}.</span>
                {g.title}
              </h3>
              <Checklist items={g.items} />
            </div>
          ))}
        </div>
      </Section>

      <Section bg={COLORS.white}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-5">
            <div data-reveal data-lightbox={b.image} data-lightbox-alt="Two children carrying a bucket along Altona Beach" className="ink-card relative aspect-[3/4] -rotate-2 overflow-hidden rounded-2xl bg-white">
              <Image src={b.image} alt="Two children carrying a bucket along Altona Beach" fill sizes="25vw" className="object-cover" />
            </div>
            <div data-reveal className="ink-card relative mt-8 aspect-[3/4] rotate-2 overflow-hidden rounded-2xl">
              <IllustratedTile animal="platypus" label="Altona Beach" tint="bg-[#9ab9c9]" className="size-full" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Program details" title="Rain, hail or shine" />
            <dl className="grid gap-4 sm:grid-cols-2">
              {b.details.map((d, i) => (
                <div key={d.label} data-reveal className={`ink-card rounded-2xl p-5 ${["bg-[#fbe3c4]", "bg-[#d9eadf]", "bg-[#f8dcd5]", "bg-[#d8e5ec]"][i]}`}>
                  <dt className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">{d.label}</dt>
                  <dd className={`${display} mt-1 text-2xl`}>{d.value}</dd>
                </div>
              ))}
            </dl>
            <Checklist items={b.features} />
            <p data-reveal className="font-bold">
              Spaces are limited — secure your child’s place in Edu-Play’s Beach Kinder Program today!
            </p>
          </div>
        </div>
      </Section>

    </Shell>
  );
}
