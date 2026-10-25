import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Blob, Checklist, COLORS, display, Floater, InkAnimal, PageHero, Prose, Section, SectionHeading, Shell, TourBand } from "@/components/site-chrome";
import { programsOverview as p } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Programs | Edu-Play Early Learning",
  description: p.intro,
};

export default function ProgramsPage() {
  return (
    <Shell>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} animal="emu" />

      <Section bg={COLORS.cream} next={COLORS.white}>
        <Blob className="-right-40 top-10 size-[30rem] bg-[#f3b46b]/30" />
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {p.cards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              data-reveal
              className={`ink-card group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-3xl p-6 ${["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]"][i]}`}
            >
              <div aria-hidden="true" className="absolute inset-0 opacity-15 [background-image:radial-gradient(#1b1714_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
              <InkAnimal kind={card.animal} className="absolute right-4 top-4 w-20 transition-transform duration-500 group-hover:-translate-y-2" />
              <div className="relative mt-20">
                <h3 className={`${display} text-3xl`}>{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-85">{card.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
                  Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section bg={COLORS.white} next={COLORS.sand}>
        <Floater kind="kookaburra" className="right-[4%] top-[4%] w-28" distance={60} rotate={5} />
        <SectionHeading eyebrow="Preschool & kindergarten" title="School readiness program" />
        <Prose className="mt-6 max-w-3xl">
          <p>{p.readiness}</p>
        </Prose>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {p.skills.map((s, i) => (
            <div key={s.title} data-reveal className="ink-card flex flex-col gap-4 rounded-3xl bg-[#fffdf8] p-6">
              <h3 className={`${display} text-2xl`}>
                <span className={`mr-3 inline-block size-3 rounded-full border-2 border-[#1b1714] ${["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]"][i % 4]}`} />
                {s.title}
              </h3>
              <Checklist items={s.items} />
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed opacity-70">
          Children develop at their own pace, and these goals are flexible and adapted to meet the individual needs and abilities of each child. Collaboration between home and kindergarten is crucial in supporting children’s readiness for the exciting journey of formal education.
        </p>
      </Section>

      <Section bg={COLORS.sand} next={COLORS.cream}>
        <Floater kind="platypus" className="left-[2%] bottom-[10%] w-36" distance={50} rotate={-5} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div data-lightbox-group className="grid grid-cols-2 gap-5">
            <div data-reveal data-lightbox={p.images.farm} data-lightbox-alt="A basket of Edu-Play grown veggies and herbs" className="tape ink-card relative aspect-[3/4] -rotate-2 overflow-hidden rounded-2xl bg-white">
              <Image src={p.images.farm} alt="A basket of Edu-Play grown veggies and herbs" fill sizes="25vw" className="object-cover" />
            </div>
            <div data-reveal data-lightbox={p.images.beach} data-lightbox-alt="Two children carrying a bucket along Altona Beach" className="tape ink-card relative mt-8 aspect-[3/4] rotate-2 overflow-hidden rounded-2xl bg-white">
              <Image src={p.images.beach} alt="Two children carrying a bucket along Altona Beach" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Beach & City Farm Kinder" title={p.outdoor.title} />
            <Prose>
              <p>{p.outdoor.body}</p>
            </Prose>
            <p className="font-bold">Children participating in our weekly excursions improve their:</p>
            <Checklist items={p.outdoor.benefits} columns={2} />
          </div>
        </div>
      </Section>

      <Section bg={COLORS.cream}>
        <Blob className="-left-32 bottom-0 size-96 bg-[#9ccbb5]/35" />
        <SectionHeading eyebrow="A holistic learning environment" title={p.classroom.title} center />
        <Prose className="mx-auto mt-6 max-w-3xl text-center">
          <p>{p.classroom.body}</p>
        </Prose>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {p.classroom.points.map((pt, i) => (
            <div key={pt} data-reveal className={`ink-card rounded-3xl p-6 leading-relaxed ${["bg-[#fffdf8]", "bg-[#dbe9de]", "bg-[#fffdf8]"][i]}`}>
              {pt}
            </div>
          ))}
        </div>
      </Section>

      <TourBand animal="dingo" />
    </Shell>
  );
}
