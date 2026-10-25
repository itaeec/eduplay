import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COLORS, display, PageHero, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { longDaycare as d, programsOverview } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Long Daycare | Edu-Play Early Learning",
  description: d.paragraphs[0],
};

export default function LongDaycarePage() {
  return (
    <Shell>
      <PageHero eyebrow="Long Daycare" title={d.title} animal="wombat" />

      <Section bg={COLORS.cream} next={COLORS.sand}>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Prose>
            {d.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Prose>
          <dl className="grid h-fit gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {d.facts.map((f, i) => (
              <div key={f.label} data-reveal className={`ink-card rounded-2xl p-5 ${["bg-[#fbe3c4]", "bg-[#d9eadf]", "bg-[#f8dcd5]", "bg-[#d8e5ec]"][i]}`}>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">{f.label}</dt>
                <dd className={`${display} mt-1 text-2xl`}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-lightbox-group className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-3">
          {d.photos.map((photo, i) => (
            <div key={photo.src} data-reveal data-lightbox={photo.src} data-lightbox-alt={photo.alt} className={`ink-card relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ${["-rotate-2", "rotate-1", "-rotate-1"][i]} ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Section>

      <Section bg={COLORS.sand}>
        <SectionHeading eyebrow="More than just childcare" title="Explore our programs" center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programsOverview.cards
            .filter((c) => c.href !== "/programs/long-daycare")
            .map((c, i) => (
              <Link key={c.title} href={c.href} data-reveal className={`ink-card rounded-3xl p-6 ${["bg-[#fffdf8]", "bg-[#dbe9de]", "bg-[#fffdf8]"][i]}`}>
                <h3 className={`${display} text-2xl`}>{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-85">{c.body}</p>
              </Link>
            ))}
        </div>
      </Section>

    </Shell>
  );
}
