import Image from "next/image";
import { ArrowRight, HeartHandshake, House, MapPin, Quote, Sprout } from "lucide-react";

import { FacebookFeed } from "@/components/facebook-feed";
import { ForegroundGrass, OutbackScene, WaveDivider } from "@/components/outback-scene";
import { COLORS, display, FacebookIcon, IllustratedTile, InkAnimal, PrimaryButton, SecondaryButton, SectionHeading, Shell, SmartLink, Wave } from "@/components/site-chrome";

import { MurmurationWordmark } from "@/components/ui/murmuration-wordmark";
import { CrowdCanvas } from "@/components/ui/skiper39";
import { homePosts as posts } from "@/lib/posts";
import { centreImages, differences, excursions, hero, links, lookAround, programs, rooms, testimonials } from "@/lib/site-content";

const differenceIcons = [House, Sprout, HeartHandshake];

export default function Home() {
  const { cream: CREAM, white: WHITE, sand: SAND, sage: SAGE } = COLORS;

  return (
    <Shell>
      {/* Hero: layered outback with the animal parade */}
      <section data-parallax-scope className="relative flex min-h-[max(100svh,780px)] flex-col overflow-hidden">
        <OutbackScene />
        <div data-hero-copy className="relative z-10 flex flex-col items-center pt-28 text-center sm:pt-32">
          <div data-intro className="flex flex-col items-center px-4">
            <span className="rounded-full border border-[#3f6f5c]/20 bg-[#fffdf8]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#3f6f5c] backdrop-blur">
              {hero.eyebrow}
            </span>
          </div>
          <h1 className="sr-only">Womindjeka — welcome to {hero.eyebrow}</h1>
          <div className="mx-auto w-full max-w-5xl">
            <MurmurationWordmark text="Womindjeka" className="h-[26vh] min-h-[180px] sm:h-[34vh] sm:min-h-[260px]" />
          </div>
          <p data-intro className="px-4 text-sm tracking-wide text-[#3b2a1a]/75 sm:text-base">
            <span className="font-bold">Womindjeka</span> — “welcome” in Boon Wurrung language
          </p>
        </div>
        <div data-speed="0.85" className="relative mt-4 min-h-[300px] flex-1">
          <CrowdCanvas className="h-full" count={12} depthRange={150} parallax={0.18} />
        </div>
        <ForegroundGrass />
      </section>

      {/* Enrolments */}
      <section className="relative overflow-hidden" style={{ background: CREAM }}>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
          <span data-reveal className="rounded-full border border-[#1b1714]/20 bg-[#f3b46b] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1b1714]">
            Enrolling now
          </span>
          <h2 data-reveal className={`${display} mt-8 text-balance text-4xl leading-[1.05] sm:text-6xl`}>
            {hero.headline}
          </h2>
          <Wave className="mt-6" />
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed opacity-80 sm:text-lg">
            {hero.description}
          </p>
          <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
            <PrimaryButton href={links.bookTour}>
              Book A Tour <ArrowRight className="size-4" />
            </PrimaryButton>
            <SecondaryButton href={links.familyTour}>Family Tours Welcome</SecondaryButton>
          </div>
          <p data-reveal className="mt-7 flex items-center gap-1.5 text-sm opacity-70">
            <MapPin className="size-4" /> {hero.address}
          </p>
        </div>
        <WaveDivider fill={WHITE} />
      </section>

      {/* The Edu-Play Difference */}
      <section className="relative overflow-hidden" style={{ background: WHITE }}>
        <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:pb-32 lg:pt-16">
          <div className="relative">
            <div data-reveal data-lightbox={centreImages.storytime.src} data-lightbox-alt={centreImages.storytime.alt} className="ink-card relative aspect-[4/3] -rotate-2 overflow-hidden rounded-[1.5rem] bg-white">
              <Image
                src={centreImages.storytime.src}
                alt={centreImages.storytime.alt}
                fill
                data-parallax-img
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="scale-[1.08] object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Why families choose us" title={"The Edu\u2011Play Difference"} />
            <ul className="flex flex-col gap-6">
              {differences.map((d, i) => {
                const Icon = differenceIcons[i];
                const tints = ["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]"];
                return (
                  <li key={d.title} data-reveal className="flex gap-4">
                    <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#1b1714]/20 ${tints[i]}`}>
                      <Icon className="size-5 text-[#1b1714]" />
                    </span>
                    <div>
                      <h3 className={`${display} text-2xl`}>{d.title}</h3>
                      <p className="mt-1.5 leading-relaxed opacity-80">{d.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div data-reveal className="flex flex-wrap gap-2">
              {programs.map((p) => (
                <SmartLink
                  key={p.label}
                  href={p.href}
                  className="rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-4 py-1.5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#9ccbb5]"
                >
                  {p.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
        <WaveDivider fill={SAND} />
      </section>

      {/* Rooms */}
      <section id="rooms" className="relative overflow-hidden scroll-mt-8" style={{ background: SAND }}>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <SectionHeading eyebrow="Our Rooms" title="Two rooms, one small & homely centre" center />
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {rooms.map((room) => {
              const joey = room.name === "Joeys";
              return (
                <article key={room.name} data-reveal data-lightbox-group className="ink-card group relative flex flex-col overflow-hidden rounded-[2rem] bg-[#fffdf8]">
                  <div data-lightbox={room.cover} data-lightbox-alt={room.coverAlt} className="relative aspect-[16/10] overflow-hidden border-b border-[#1b1714]/10">
                    <Image
                      src={room.cover}
                      alt={room.coverAlt}
                      fill
                      data-parallax-img
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="scale-[1.08] object-cover"
                    />
                    <div
                      data-float="20"
                      data-rotate={joey ? "-3" : "3"}
                      className={`absolute right-5 top-5 transition-transform duration-500 group-hover:-translate-y-2 ${joey ? "w-20 sm:w-24" : "w-28 sm:w-36"}`}
                    >
                      <InkAnimal kind="kangaroo" flip={!joey} className="w-full" />
                    </div>
                  </div>
                  <div className={`relative flex flex-col gap-4 p-7 ${joey ? "bg-[#fbe3c4]" : "bg-[#d9eadf]"}`}>
                    <div className="relative flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1b1714]/70">Room {room.number}</span>
                        <h3 className={`${display} mt-1 text-5xl sm:text-6xl`}>{room.name}</h3>
                      </div>
                      <p className="inline-flex rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-4 py-1.5 text-sm font-bold">
                        {room.ages}
                      </p>
                    </div>
                    <ul className="relative grid grid-cols-4 gap-2">
                      {room.photos.map((photo, i) => (
                        <li key={photo.src} data-lightbox={photo.src} data-lightbox-alt={photo.alt} className={`relative aspect-square overflow-hidden rounded-xl border border-[#1b1714]/20 bg-white ${["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"][i]}`}>
                          <Image src={photo.src} alt={photo.alt} fill sizes="12vw" className="object-cover transition duration-500 hover:scale-110" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <WaveDivider fill={WHITE} />
      </section>

      {/* Look around */}
      <section className="relative overflow-hidden" style={{ background: WHITE }}>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <SectionHeading eyebrow={lookAround.eyebrow} title={lookAround.heading} center />
          <div data-lightbox-group className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-3">
            {lookAround.photos.map((photo, i) => (
              <figure
                key={photo.src}
                data-reveal
                data-lightbox={photo.src}
                data-lightbox-alt={photo.caption}
                className={`ink-card relative overflow-hidden rounded-2xl bg-white ${["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"][i]} ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <figcaption className={`${display} border-t border-[#1b1714]/10 bg-[#fffdf8] px-4 py-2.5 text-center text-lg`}>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <WaveDivider fill={CREAM} />
      </section>

      {/* Excursions */}
      <section className="relative overflow-hidden" style={{ background: CREAM }}>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <SectionHeading eyebrow={excursions.eyebrow} title={excursions.heading} center />
          <div data-lightbox-group className="mt-16 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4 lg:grid-rows-2">
            <div data-reveal data-lightbox={excursions.photo.src} data-lightbox-alt={excursions.photo.alt} className="ink-card relative col-span-2 aspect-[4/3] -rotate-2 overflow-hidden rounded-2xl bg-white lg:row-span-2 lg:aspect-auto">
              <Image
                src={excursions.photo.src}
                alt={excursions.photo.alt}
                fill
                data-parallax-img
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="scale-[1.08] object-cover"
              />
            </div>
            {excursions.tiles.map((tile, i) =>
              "photo" in tile ? (
                <div key={tile.label} data-reveal data-lightbox={tile.photo} data-lightbox-alt={tile.alt} className={`ink-card relative aspect-square overflow-hidden rounded-2xl bg-white ${["rotate-2", "-rotate-1", "rotate-3", "-rotate-2"][i]}`}>
                  <Image src={tile.photo} alt={tile.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  <span className={`${display} absolute inset-x-3 bottom-3 rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-3 py-1 text-center text-base`}>{tile.label}</span>
                </div>
              ) : (
                <IllustratedTile
                  key={tile.label}
                  animal={tile.animal}
                  label={tile.label}
                  tint={tile.tint}
                  flip={i % 2 === 1}
                  className={`ink-card aspect-square rounded-2xl ${["rotate-2", "-rotate-1", "rotate-3", "-rotate-2"][i]}`}
                />
              ),
            )}
          </div>
        </div>
        <WaveDivider fill={SAGE} />
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden" style={{ background: SAGE }}>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <SectionHeading eyebrow="Community Testimonials" title="What our families say" center />
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {testimonials.map((t, i) => {
              const tops = ["bg-[#f3b46b]", "bg-[#efb8ad]", "bg-[#9ab9c9]"];
              return (
                <figure
                  key={t.author}
                  data-reveal
                  className="ink-card flex flex-col overflow-hidden rounded-3xl bg-[#fffdf8]"
                >
                  <div className={`flex items-center justify-between border-b border-[#1b1714]/10 px-6 py-3 ${tops[i]}`}>
                    <Quote className="size-5 text-[#1b1714]" />
                    <span className="text-xs font-bold uppercase tracking-[0.16em]">Family</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-7">
                    <h3 className={`${display} text-2xl leading-snug`}>{t.title}</h3>
                    <blockquote className="flex-1 leading-relaxed opacity-80">“{t.quote}”</blockquote>
                    <figcaption className="text-sm font-bold">— {t.author}</figcaption>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
        <WaveDivider fill={WHITE} />
      </section>

      {/* News */}
      <section className="relative overflow-hidden" style={{ background: CREAM }}>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="News" title="From our blog" />
            <SmartLink href={links.news} className="flex items-center gap-1.5 rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5">
              All articles <ArrowRight className="size-4" />
            </SmartLink>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {posts.map((post, i) => (
              <SmartLink key={post.href} href={post.href} data-reveal className="group flex flex-col gap-5">
                <div className={`ink-card relative aspect-[3/2] overflow-hidden rounded-2xl bg-white ${["-rotate-1", "rotate-1", "-rotate-1"][i]}`}>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <IllustratedTile animal={(["bilby", "wombat", "kookaburra"] as const)[i]} className="size-full" />
                  )}
                </div>
                <h3 className={`${display} text-2xl leading-snug transition group-hover:text-[#3f6f5c]`}>
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed opacity-75">{post.excerpt}</p>
              </SmartLink>
            ))}
          </div>
        </div>
        <WaveDivider fill={SAGE} />
      </section>

      {/* Facebook */}
      <section id="facebook" className="relative overflow-hidden" style={{ background: SAGE }}>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-10 sm:px-6 lg:pb-32">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Facebook" title="Latest from our centre" />
            <p data-reveal className="max-w-md leading-relaxed opacity-80">
              See what the Joeys and Kangaroos have been up to — excursions, projects and centre news,
              straight from our Facebook page.
            </p>
            <div data-reveal className="flex items-center gap-5">
              <PrimaryButton href={links.facebook}>
                <FacebookIcon className="size-4" /> Follow us on Facebook
              </PrimaryButton>
            </div>
          </div>
          <FacebookFeed />
        </div>
      </section>

    </Shell>
  );
}
