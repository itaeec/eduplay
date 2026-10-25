import type { Metadata } from "next";
import Image from "next/image";
import { COLORS, display, IllustratedTile, PageHero, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { cityFarm as c } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "City Farm Kinder | Edu-Play Early Learning",
  description: c.intro,
};

export default function CityFarmPage() {
  return (
    <Shell>
      <PageHero eyebrow="Weekly excursion" title={c.title} intro={c.intro} animal="kookaburra" />

      <Section bg={COLORS.cream} next={COLORS.sage}>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-6 lg:sticky lg:top-8">
            <div data-reveal data-lightbox={c.image} data-lightbox-alt="Edu-Play grown veggies and herbs" className="ink-card relative aspect-[4/3] -rotate-2 overflow-hidden rounded-2xl bg-white">
              <Image src={c.image} alt="A basket of Edu-Play grown veggies and herbs: cherry tomatoes, broad beans, chives, mint and rosemary" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div data-reveal className="ink-card relative aspect-[4/3] rotate-1 overflow-hidden rounded-2xl">
              <IllustratedTile animal="wombat" label="Animal care" tint="bg-[#9ccbb5]" flip className="size-full" />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            {c.sections.map((s, i) => (
              <div key={s.title} data-reveal className="flex gap-5">
                <span className={`mt-1 size-4 shrink-0 rounded-full border border-[#1b1714]/20 ${["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]", "bg-[#f3b46b]"][i]}`} />
                <div>
                  <h2 className={`${display} text-2xl sm:text-3xl`}>{s.title}</h2>
                  <p className="mt-3 leading-relaxed opacity-85">{s.body}</p>
                </div>
              </div>
            ))}
            <Prose>
              <p className="font-bold">{c.outro}</p>
            </Prose>
          </div>
        </div>
      </Section>

      <Section bg={COLORS.sage}>
        <SectionHeading eyebrow="Seed to feed" title="Plant · Grow · Harvest · Cook · Compost" center />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {["Plant seeds", "Water & weed", "Care for animals", "Harvest", "Cook with Lauren", "Save seeds", "Compost & worm farm"].map((step, i) => (
            <span key={step} data-reveal className={`rounded-full border border-[#1b1714]/20 px-5 py-2 text-sm font-bold ${["bg-[#fffdf8]", "bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]"][i % 4]}`}>
              {step}
            </span>
          ))}
        </div>
      </Section>

    </Shell>
  );
}
