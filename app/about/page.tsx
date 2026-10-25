import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Blob,
  Checklist,
  COLORS,
  display,
  Floater,
  InkAnimal,
  PageHero,
  PrimaryButton,
  Prose,
  Section,
  SectionHeading,
  Shell,
  TourBand,
} from "@/components/site-chrome";
import { enrolment, owner } from "@/lib/pages-content";
import { links } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Us & Enrolment | Edu-Play Early Learning",
  description: enrolment.intro,
};

export default function AboutPage() {
  return (
    <Shell>
      <PageHero eyebrow="About Us" title={enrolment.title} intro={enrolment.intro} animal="koala" />

      <Section bg={COLORS.cream} next={COLORS.sand}>
        <Blob className="-right-32 top-20 size-96 bg-[#f3b46b]/30" />
        <Floater kind="bilby" className="right-[3%] top-[40%] w-32" distance={60} rotate={-4} />
        <SectionHeading eyebrow="Step by step" title="How to enrol your child" />
        <ol className="relative mt-12 grid gap-6 lg:max-w-4xl">
          {enrolment.steps.map((step, i) => (
            <li key={step.title} data-reveal className="ink-card flex gap-5 rounded-3xl bg-[#fffdf8] p-6 sm:gap-7 sm:p-8">
              <span className={`${display} flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#1b1714] bg-[#f3b46b] text-xl shadow-[3px_3px_0_#1b1714]`}>
                {i + 1}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className={`${display} text-2xl`}>{step.title}</h3>
                <p className="leading-relaxed opacity-85">{step.body}</p>
                {step.checks && <Checklist items={step.checks} columns={2} />}
              </div>
            </li>
          ))}
        </ol>
        <Prose className="mt-12 max-w-3xl">
          <p>{enrolment.outro}</p>
        </Prose>
        <div data-reveal className="mt-8">
          <PrimaryButton href={links.bookTour}>
            Book A Tour <ArrowRight className="size-4" />
          </PrimaryButton>
        </div>
      </Section>

      <Section bg={COLORS.sand}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal data-lightbox={owner.image} data-lightbox-alt="Edu-Play Early Learning Centre on Railway St North, Altona" className="tape ink-card relative aspect-[4/3] -rotate-2 overflow-hidden rounded-[1.5rem] bg-white">
            <Image src={owner.image} alt="Edu-Play Early Learning Centre on Railway St North, Altona" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Family owned" title="Meet the owners" />
            <Prose>
              <p>{owner.intro}</p>
              <p>{owner.family[0]}</p>
            </Prose>
            <div data-reveal className="flex items-center gap-5">
              <Link href="/meet-the-owner" className="inline-flex items-center gap-2 rounded-full border-2 border-[#1b1714] bg-[#fffdf8] px-6 py-3 text-sm font-bold shadow-[3px_3px_0_#1b1714] transition hover:-translate-y-0.5 hover:bg-[#9ccbb5]">
                Grace’s story <ArrowRight className="size-4" />
              </Link>
              <InkAnimal kind="wombat" className="w-24 animate-bob" />
            </div>
          </div>
        </div>
      </Section>

      <TourBand animal="kangaroo" />
    </Shell>
  );
}
