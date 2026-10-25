import type { Metadata } from "next";

import { Blob, COLORS, display, Floater, PageHero, Section, Shell, TourBand } from "@/components/site-chrome";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqGroups } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "FAQs | Edu-Play Early Learning",
  description: "Answers to common questions about daycare kindergarten, enrolments, subsidies and our centre.",
};

export default function FaqsPage() {
  return (
    <Shell>
      <PageHero eyebrow="FAQs" title="Questions families ask" intro="Everything you need to know about daycare kindergarten, enrolments, subsidies and life at Edu-Play." animal="wombat" />

      <Section bg={COLORS.cream}>
        <Blob className="-right-40 top-1/4 size-[28rem] bg-[#f3b46b]/30" />
        <Floater kind="koala" className="right-[3%] top-[6%] w-32" distance={60} rotate={-4} />
        <Floater kind="bilby" flip className="left-[2%] bottom-[8%] w-32" distance={40} rotate={3} />
        <div className="mx-auto grid max-w-4xl gap-12">
          {faqGroups.map((g, i) => (
            <div key={g.title} className="grid gap-5">
              <h2 data-reveal className={`${display} text-3xl`}>
                <span className={`mr-3 inline-block size-3 rounded-full border-2 border-[#1b1714] ${["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]"][i % 4]}`} />
                {g.title}
              </h2>
              <Accordion data-reveal className="ink-card rounded-3xl bg-[#fffdf8] px-6 py-2 sm:px-8">
                {g.items.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="border-b-2 border-dashed border-[#1b1714]/20 last:border-0">
                    <AccordionTrigger className={`${display} py-5 text-lg hover:no-underline sm:text-xl`}>{f.q}</AccordionTrigger>
                    <AccordionContent className="pb-5 text-base leading-relaxed opacity-80">
                      {f.a}
                      {"link" in f && f.link && (
                        <>
                          {" "}
                          <a href={f.link.href} target="_blank" rel="noreferrer" className="font-bold text-[#3f6f5c] underline underline-offset-4">
                            {f.link.label}
                          </a>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </Section>

      <TourBand animal="echidna" />
    </Shell>
  );
}
