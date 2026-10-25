import { ArrowRight, Check, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Lightbox } from "@/components/lightbox";
import { ScrollEffects } from "@/components/scroll-effects";
import { WaveDivider } from "@/components/outback-scene";
import { animalDataUri, type AnimalKind } from "@/components/ui/australian-animals";
import { withBase } from "@/lib/base-path";
import { footer, hero, links, nav } from "@/lib/site-content";

export const display = "font-[family-name:var(--font-display)]";

export const COLORS = {
  cream: "#fbf6ec",
  white: "#fffdf8",
  sand: "#f4e4c8",
  sage: "#dbe9de",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" className={`h-3 w-24 text-[#9ccbb5] ${className}`}>
      <path
        d="M2 6 C12 -1 18 13 28 6 S44 -1 54 6 S70 13 80 6 S96 -1 106 6 S116 11 118 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The centre's logo (transparent PNG, so it sits on any background). */
export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <Link href="/" aria-label="Edu-Play Early Education Centre — home" className="inline-flex shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBase("/images/logo.png")}
        alt="Edu-Play Early Education Centre"
        className={variant === "dark" ? "h-20 w-auto sm:h-24" : "h-16 w-auto drop-shadow-[0_1px_0_rgba(255,253,248,0.9)] sm:h-20"}
      />
    </Link>
  );
}

export function InkAnimal({
  kind,
  className = "",
  flip = false,
}: {
  kind: AnimalKind;
  className?: string;
  flip?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={animalDataUri(kind)}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none drop-shadow-[2px_4px_0_rgba(27,23,20,0.12)] ${flip ? "-scale-x-100" : ""} ${className}`}
    />
  );
}

/** Soft colour blob that drifts slower than its section for depth. */
export function Blob({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" data-pin-bg className={`pointer-events-none absolute rounded-full blur-2xl ${className}`} />;
}

/** A decorative animal that floats past as the section scrolls. */
export function Floater({
  kind,
  className = "",
  flip = false,
  distance = 70,
  rotate = 4,
}: {
  kind: AnimalKind;
  className?: string;
  flip?: boolean;
  distance?: number;
  rotate?: number;
}) {
  return (
    <div data-float={distance} data-rotate={rotate} className={`pointer-events-none absolute hidden md:block ${className}`}>
      <InkAnimal kind={kind} flip={flip} className="w-full animate-bob" />
    </div>
  );
}

export function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  center = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div data-reveal className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{eyebrow}</span>}
      <Tag className={`${display} text-balance text-4xl leading-[1.05] sm:text-5xl`}>{title}</Tag>
      <Wave />
    </div>
  );
}

/** Renders <Link> for site routes and a new-tab <a> for external URLs. */
export function SmartLink({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode } & Record<string, unknown>) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

const primaryClass =
  "inline-flex items-center gap-2 rounded-full border-2 border-[#1b1714] bg-[#3f6f5c] px-6 py-3 text-sm font-bold text-white shadow-[3px_3px_0_#1b1714] transition hover:-translate-y-0.5 hover:bg-[#335b4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f6f5c]";
const secondaryClass =
  "inline-flex items-center gap-2 rounded-full border-2 border-[#1b1714] bg-[#fffdf8] px-6 py-3 text-sm font-bold shadow-[3px_3px_0_#1b1714] transition hover:-translate-y-0.5 hover:bg-[#9ccbb5]";

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <SmartLink href={href} className={primaryClass}>
      {children}
    </SmartLink>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <SmartLink href={href} className={secondaryClass}>
      {children}
    </SmartLink>
  );
}

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="opacity-80 transition hover:opacity-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={links.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Edu-Play on Facebook"
            className="flex size-9 items-center justify-center rounded-full border-2 border-[#1b1714] bg-[#fffdf8]/70 text-[#1b1714] transition hover:bg-[#1877f2] hover:text-white"
          >
            <FacebookIcon className="size-4" />
          </a>
          <a
            href={links.bookTour}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-[#1b1714] bg-[#3f6f5c] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#1b1714] transition hover:-translate-y-0.5 hover:bg-[#335b4b]"
          >
            Book A Tour
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-[#1b1714] text-[#fbf6ec]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="max-w-xl text-sm leading-relaxed opacity-75">{footer.culturalSafety}</p>
          <p className="flex items-center gap-1.5 text-sm opacity-90">
            <MapPin className="size-4" /> {hero.address}
          </p>
          <a
            href={links.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 text-sm font-semibold opacity-90 hover:opacity-100"
          >
            <FacebookIcon className="size-4" /> Follow us on Facebook
          </a>
        </div>
        <ul className="flex flex-col gap-2 text-sm md:items-end">
          {[...nav, ...footer.links].map((l) => (
            <li key={l.label}>
              <SmartLink href={l.href} className="opacity-75 hover:opacity-100">
                {l.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-60">© Edu-Play Early Learning Centre, Altona</div>
    </footer>
  );
}

/** Page wrapper: scroll effects, header and footer around the content. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-clip bg-[#fbf6ec] text-[#3b2a1a]">
      <ScrollEffects />
      <Lightbox />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

/** Short outback banner used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  animal = "kangaroo",
  flip = false,
  fill = COLORS.cream,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  animal?: AnimalKind;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <section data-parallax-scope className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7eadb_0%,#fbf1e4_45%,#f3cfa6_100%)]" />
        <div data-speed="0.2" className="absolute right-[6%] top-[14%] size-20 rounded-full bg-[#f3b46b] shadow-[0_0_60px_24px_rgba(243,180,107,0.35)] sm:size-28" />
        <svg data-speed="0.4" viewBox="0 0 1600 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[55%] w-full">
          <path d="M0 200 C200 120 400 170 600 120 C800 70 1000 160 1200 110 C1400 60 1500 120 1600 100 L1600 300 L0 300 Z" fill="#d6e6d6" />
        </svg>
        <svg data-speed="0.6" viewBox="0 0 1600 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42%] w-full">
          <path d="M0 220 C180 160 340 200 520 160 C700 120 860 200 1040 180 C1220 160 1400 110 1600 150 L1600 300 L0 300 Z" fill="#b9d8c4" stroke="#1b1714" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-24 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
        <div data-intro className="flex max-w-3xl flex-col gap-4">
          {eyebrow && (
            <span className="w-fit rounded-full border border-[#3f6f5c]/20 bg-[#fffdf8]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#3f6f5c] backdrop-blur">
              {eyebrow}
            </span>
          )}
          <h1 className={`${display} text-balance text-4xl leading-[1.05] sm:text-6xl`}>{title}</h1>
          {intro && <p className="max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg">{intro}</p>}
        </div>
        <div data-speed="0.9" className="pointer-events-none absolute bottom-4 right-[4%] w-32 sm:w-44 lg:right-[8%] lg:w-56">
          <InkAnimal kind={animal} flip={flip} className="w-full animate-bob" />
        </div>
      </div>
      <WaveDivider fill={fill} className="relative" />
    </section>
  );
}

/** Content section with a background colour and optional wavy bottom seam. */
export function Section({
  children,
  bg = COLORS.cream,
  next,
  id,
  className = "",
}: {
  children: ReactNode;
  bg?: string;
  next?: string;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:pb-28">{children}</div>
      {next && <WaveDivider fill={next} />}
    </section>
  );
}

/** Tick list, used for benefits and skills. */
export function Checklist({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} data-reveal className="flex gap-3 leading-relaxed">
          <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#1b1714] bg-[#9ccbb5]">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="opacity-90">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Scrapbook tile with an animal and a label, used where a photo would go. */
export function IllustratedTile({
  animal,
  label,
  tint = "bg-[#dbe9de]",
  className = "",
  flip = false,
}: {
  animal: AnimalKind;
  label?: string;
  tint?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center ${tint} ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-15 [background-image:radial-gradient(#1b1714_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
      <InkAnimal kind={animal} flip={flip} className="relative w-[55%] max-w-40 animate-bob" />
      {label && <span className={`${display} relative text-xl sm:text-2xl`}>{label}</span>}
    </div>
  );
}

/** Cream tile with the centre's logo. */
export function LogoTile({ caption, className = "" }: { caption?: string; className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-[#fbf6ec] p-8 text-center ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-10 [background-image:radial-gradient(#1b1714_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBase("/images/logo.png")} alt="" className="relative w-[70%] max-w-xs" />
      {caption && <span className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{caption}</span>}
    </div>
  );
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-4 text-base leading-relaxed opacity-85 sm:text-lg ${className}`}>{children}</div>;
}

export function InkCard({ children, className = "", tint = "bg-[#fffdf8]" }: { children: ReactNode; className?: string; tint?: string }) {
  return (
    <div data-reveal className={`ink-card relative overflow-hidden rounded-3xl ${tint} ${className}`}>
      {children}
    </div>
  );
}

/** Closing call to action used on every inner page. */
export function TourBand({ animal = "kangaroo" }: { animal?: AnimalKind }) {
  return (
    <section className="relative overflow-hidden" style={{ background: COLORS.sage }}>
      <Blob className="-left-32 top-0 size-96 bg-[#fffdf8]/70" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:py-24">
        <div data-float="30" data-rotate="3" className="w-28 sm:w-36">
          <InkAnimal kind={animal} className="w-full animate-bob" />
        </div>
        <h2 data-reveal className={`${display} text-balance text-3xl sm:text-5xl`}>
          Come and see the Edu-Play difference
        </h2>
        <p data-reveal className="max-w-xl opacity-80">
          Family tours are always welcome. Visit our small and homely centre at {hero.address}.
        </p>
        <div data-reveal className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={links.bookTour}>
            Book A Tour <ArrowRight className="size-4" />
          </PrimaryButton>
          <SecondaryButton href="/contact">Contact Us</SecondaryButton>
        </div>
      </div>
    </section>
  );
}
