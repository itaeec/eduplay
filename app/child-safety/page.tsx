import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { Blob, Checklist, COLORS, display, Floater, PageHero, PrimaryButton, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { childSafety as c } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Child Safety | Edu-Play Early Learning",
  description: "Our commitment to child safety and wellbeing, and how we support Victoria's Child Safe Standards.",
};

const tints = ["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]"];

export default function ChildSafetyPage() {
  return (
    <Shell>
      <PageHero eyebrow={c.eyebrow} title={c.title} animal="koala" />

      <Section bg={COLORS.cream} next={COLORS.white}>
        <Blob className="-left-40 top-10 size-[26rem] bg-[#9ccbb5]/35" />
        <blockquote data-reveal className="ink-card relative mx-auto max-w-4xl rounded-[2rem] bg-[#fffdf8] p-8 text-lg leading-relaxed sm:p-12 sm:text-xl">
          <span className={`${display} absolute -top-6 left-8 text-7xl text-[#9ccbb5]`}>“</span>
          {c.statement}
        </blockquote>
      </Section>

      <Section bg={COLORS.white} next={COLORS.sand}>
        <Floater kind="kangaroo" className="right-[2%] top-[2%] w-36" distance={70} rotate={-4} />
        <SectionHeading eyebrow="Victoria's 11 Child Safe Standards" title="Supporting the Child Safe Standards" />
        <Prose className="mt-6 max-w-3xl">
          <p>{c.standardsIntro}</p>
        </Prose>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.standards.map((s, i) => (
            <li key={s.n} data-reveal className="ink-card flex flex-col gap-3 rounded-3xl bg-[#fffdf8] p-6">
              <span className={`${display} flex size-10 items-center justify-center rounded-full border-2 border-[#1b1714] text-lg shadow-[2px_2px_0_#1b1714] ${tints[i % 4]}`}>{s.n}</span>
              <h3 className={`${display} text-xl leading-snug`}>{s.title}</h3>
              <p className="text-sm leading-relaxed opacity-85">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section bg={COLORS.sand}>
        <Blob className="-right-32 bottom-0 size-96 bg-[#f3b46b]/30" />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Oversight" title={c.reportable.title} />
            <Prose>
              <p>{c.reportable.body}</p>
            </Prose>
            <Checklist items={c.reportable.points} />
            <p className="font-bold">Edu-Play Early Learning is committed to protecting children and promoting their safety.</p>
          </div>
          <div data-reveal className="ink-card flex flex-col gap-4 rounded-3xl bg-[#fffdf8] p-7">
            <h3 className={`${display} text-2xl`}>Want to learn more?</h3>
            <p className="leading-relaxed opacity-85">
              We have created a learning module for our educators and community with essential information and guidelines on the Child Safe Standards. Thank you for your commitment to child safety.
            </p>
            <div>
              <PrimaryButton href={c.module.href}>
                {c.module.label} <ExternalLink className="size-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
