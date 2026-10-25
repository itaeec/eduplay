import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

import { Blob, COLORS, display, Floater, PageHero, PrimaryButton, SecondaryButton, Section, SectionHeading, Shell } from "@/components/site-chrome";
import { contact as c } from "@/lib/pages-content";
import { links } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact Us | Edu-Play Early Learning",
  description: `Phone ${c.phone}, email ${c.email} or visit us at ${c.address}.`,
};

export default function ContactPage() {
  const tel = c.phone.replace(/[^\d+]/g, "");
  const map = `https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`;
  return (
    <Shell>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro="Contact us via phone or email, or book a tour online. Family tours are always welcome." animal="kangaroo" />

      <Section bg={COLORS.cream} next={COLORS.sage}>
        <Blob className="-right-40 top-0 size-[26rem] bg-[#f3b46b]/30" />
        <Floater kind="kookaburra" className="right-[4%] bottom-[6%] w-28" distance={50} rotate={4} />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-5">
            {[
              { icon: Phone, label: "Phone", value: c.phone, href: `tel:${tel}`, tint: "bg-[#f3b46b]" },
              { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}`, tint: "bg-[#9ccbb5]" },
              { icon: MapPin, label: "Address", value: c.address, href: `https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}`, tint: "bg-[#efb8ad]" },
            ].map((item) => (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" data-reveal className="ink-card flex min-w-0 items-center gap-5 rounded-3xl bg-[#fffdf8] p-6">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1b1714] shadow-[3px_3px_0_#1b1714] ${item.tint}`}>
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-70">{item.label}</span>
                  <span className={`${display} block break-words text-lg sm:text-xl lg:text-2xl`}>{item.value}</span>
                </span>
              </a>
            ))}
            <div data-reveal className="mt-2 flex flex-wrap gap-3">
              <PrimaryButton href={links.bookTour}>
                Book A Tour <ArrowRight className="size-4" />
              </PrimaryButton>
              <SecondaryButton href={links.bookTour}>Join our waitlist</SecondaryButton>
            </div>
          </div>
          <div data-reveal className="ink-card relative min-h-[380px] overflow-hidden rounded-[2rem] bg-[#dbe9de]">
            <iframe
              src={map}
              title="Map showing Edu-Play Early Learning Centre, 47 Railway St N, Altona"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      </Section>

      <Section bg={COLORS.sage}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal data-lightbox={c.image} data-lightbox-alt="The Edu-Play sign and front fence on Railway St North" className="tape ink-card relative aspect-[4/3] -rotate-2 overflow-hidden rounded-[1.5rem] bg-white">
            <Image src={c.image} alt="The Edu-Play sign and front fence on Railway St North" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Online enrolment & tour bookings" title="Ready to visit?" />
            <p className="leading-relaxed opacity-85">
              Tours run most weekdays. Book online and we’ll confirm a time that suits your family, or call the centre and speak to our team.
            </p>
            <div data-reveal>
              <PrimaryButton href={links.familyTour}>
                Family Tours Welcome <ArrowRight className="size-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
