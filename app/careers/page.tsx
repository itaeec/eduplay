import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { COLORS, display, PageHero, PrimaryButton, Prose, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { careers as c, contact } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Careers | Edu-Play Early Learning",
  description: c.intro,
};

export default function CareersPage() {
  return (
    <Shell>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} animal="cockatoo" />

      <Section bg={COLORS.cream} next={COLORS.sage}>
        <SectionHeading eyebrow="Join our team" title="Everything you need, in one place" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.groups.map((g, i) => (
            <div key={g.title} data-reveal className={`ink-card flex flex-col gap-4 rounded-3xl p-6 ${["bg-[#fffdf8]", "bg-[#dbe9de]", "bg-[#fffdf8]", "bg-[#f4e4c8]", "bg-[#fffdf8]", "bg-[#dbe9de]"][i]}`}>
              <h3 className={`${display} text-2xl`}>{g.title}</h3>
              <p className="text-sm leading-relaxed opacity-85">{g.body}</p>
              <ul className="mt-auto flex flex-col gap-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-4 py-1.5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#f3b46b]">
                      {l.label} <ExternalLink className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section bg={COLORS.sage}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Information for educators" title={c.childSafe.title} />
            <Prose>
              <p>{c.childSafe.body}</p>
            </Prose>
            <div data-reveal>
              <PrimaryButton href={c.childSafe.link.href}>
                {c.childSafe.link.label} <ExternalLink className="size-4" />
              </PrimaryButton>
            </div>
          </div>
          <div data-reveal className="ink-card rounded-3xl bg-[#fffdf8] p-7">
            <h3 className={`${display} text-2xl`}>Write to us</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-85">Questions about working with us? Get in touch with the centre.</p>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="font-bold">Phone</dt>
                <dd><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="text-[#3f6f5c] underline underline-offset-4">{contact.phone}</a></dd>
              </div>
              <div>
                <dt className="font-bold">Email</dt>
                <dd><a href={`mailto:${contact.email}`} className="break-all text-[#3f6f5c] underline underline-offset-4">{contact.email}</a></dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
