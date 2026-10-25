import type { Metadata } from "next";
import Image from "next/image";

import { COLORS, display, PageHero, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { owner } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Meet The Owner | Edu-Play Early Learning",
  description: owner.intro,
};

export default function OwnerPage() {
  return (
    <Shell>
      <PageHero eyebrow={owner.eyebrow} title={owner.title} intro={owner.intro} animal="kangaroo" />

      <Section bg={COLORS.cream} next={COLORS.white}>
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Family owned centre" title="Born and raised in Altona" />
            <Prose>
              {owner.family.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Prose>
          </div>
          <figure data-reveal className="ink-card relative rotate-2 overflow-hidden rounded-[1.5rem] bg-[#fffdf8] p-3">
            <div data-lightbox={owner.image} data-lightbox-alt="Edu-Play Early Learning Centre, 47 Railway St North, Altona" className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={owner.image} alt="Edu-Play Early Learning Centre, 47 Railway St North, Altona" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="px-2 pt-3 text-center text-sm opacity-70">Edu-Play Early Learning Centre, 47 Railway St North, Altona</figcaption>
          </figure>
        </div>
      </Section>

      <Section bg={COLORS.white}>
        <SectionHeading eyebrow="Our journey" title={owner.timelineTitle} center />
        <ol className="relative mx-auto mt-14 max-w-3xl border-l-2 border-dashed border-[#1b1714]/30 pl-8 sm:pl-12">
          {owner.timeline.map((t, i) => (
            <li key={t.years} data-reveal className="relative mb-10 last:mb-0">
              <span className={`absolute -left-[2.85rem] top-1 flex size-7 items-center justify-center rounded-full border border-[#1b1714]/20 sm:-left-[3.85rem] ${["bg-[#fbe3c4]", "bg-[#d9eadf]", "bg-[#f8dcd5]", "bg-[#d8e5ec]"][i % 4]}`} />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{t.years}</span>
              <h3 className={`${display} mt-1 text-2xl sm:text-3xl`}>{t.title}</h3>
              <p className="mt-3 leading-relaxed opacity-85">{t.body}</p>
            </li>
          ))}
        </ol>
      </Section>

    </Shell>
  );
}
