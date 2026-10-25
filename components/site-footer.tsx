"use client";

import DoodleCrewFooter, { type CrewMember, type FooterColumn } from "@/components/ui/doodle-crew-footer";
import { withBase } from "@/lib/base-path";
import { footer, hero, links } from "@/lib/site-content";

// Internal links need the GitHub Pages sub-folder prefix; external ones don't.
const href = (h: string) => (h.startsWith("/") ? withBase(h) : h);

const columns: FooterColumn[] = [
  {
    title: "Our centre",
    links: [
      { label: "About Us", href: href("/about") },
      { label: "Our Rooms", href: href("/#rooms") },
      { label: "Meet The Owner", href: href("/meet-the-owner") },
      { label: "Careers", href: href("/careers") },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Long Daycare", href: href("/programs/long-daycare") },
      { label: "Kindergarten", href: href("/programs") },
      { label: "City Farm Kinder", href: href("/programs/city-farm-kinder") },
      { label: "Beach Kinder", href: href("/programs/beach-kinder") },
    ],
  },
  {
    title: "Families",
    links: [
      { label: "News", href: href("/news") },
      { label: "FAQs", href: href("/faqs") },
      { label: "Child Safety", href: href("/child-safety") },
      { label: "Circle Of Security", href: href("/circle-of-security") },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Contact Us", href: href("/contact") },
      { label: "Book A Tour", href: links.bookTour },
      { label: "Family Tours", href: links.familyTour },
      { label: "Facebook", href: links.facebook },
    ],
  },
];

// Letters: E0 D1 U2 P3 L4 A5 Y6
const crew: CrewMember[] = [
  { kind: "kid", letter: 1, seat: "top", offset: -0.02, name: "Mia", says: "Womindjeka! Welcome!" },
  { kind: "bird", letter: 3, seat: "top", offset: 0.05, name: "Kooka", says: "See you at City Farm!" },
  { kind: "mushroom", letter: 4, seat: "front", offset: 0.38, scale: 0.95, name: "Sprout", says: "Seed to feed!" },
  { kind: "cat", letter: 6, seat: "front", offset: 0.48, flip: true, name: "Patch", says: "Come for a tour, I'll show you round." },
];

export function SiteFooter() {
  return (
    <>
      <p className="bg-[#f8efe1] px-4 pt-10 text-center text-sm leading-relaxed text-[#3b2a1a]/75">
        <span className="mx-auto block max-w-3xl">{footer.culturalSafety}</span>
      </p>
      <DoodleCrewFooter
        wordmark="EDUPLAY"
        brand="Edu-Play Early Learning"
        blurb={`Small and homely long daycare & kindergarten. ${hero.address}.`}
        tagline="A small, homely place to learn and play in Altona."
        columns={columns}
        actions={[
          { label: "Follow on Facebook", href: links.facebook, icon: "heart", variant: "outline" },
          { label: "Book a tour", href: links.bookTour, icon: "star", variant: "solid" },
        ]}
        copyright="© 2026 Edu-Play Early Learning Centre, Altona"
        legal={footer.links.filter((l) => /Privacy|Terms/.test(l.label)).map((l) => ({ label: l.label, href: href(l.href) }))}
        socials={[{ label: "Facebook", href: links.facebook }]}
        crew={crew}
        doodles={["star", "heart", "sparkle", "plane", "star", "heart"]}
        doodleCount={9}
        palette={{ background: "#f8efe1", ink: "#1b1714", accent: "#e9a35b" }}
        serifFamily="var(--font-display), Georgia, serif"
        height="640px"
      />
    </>
  );
}
