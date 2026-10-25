import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { COLORS, display, PageHero, Section, Shell } from "@/components/site-chrome";
import { formatDate, posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "News | Edu-Play Early Learning",
  description: "News, projects and resources from Edu-Play Early Learning Centre in Altona.",
};

export default function NewsPage() {
  const [featured, ...rest] = posts;
  return (
    <Shell>
      <PageHero eyebrow="News" title="From our centre" intro="Projects, excursions, resources and centre news from the Joeys and Kangaroos." animal="cockatoo" />

      <Section bg={COLORS.cream}>

        <Link href={`/news/${featured.slug}`} data-reveal className="ink-card group grid overflow-hidden rounded-[2rem] bg-[#fffdf8] lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
            {featured.image && <Image src={featured.image} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
          </div>
          <div className="flex flex-col gap-4 p-8 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">Latest · {formatDate(featured.date)}</span>
            <h2 className={`${display} text-3xl leading-tight sm:text-4xl group-hover:text-[#3f6f5c]`}>{featured.title}</h2>
            <p className="leading-relaxed opacity-80">{featured.excerpt}</p>
            <span className="mt-auto font-bold">Read more →</span>
          </div>
        </Link>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Link key={post.slug} href={`/news/${post.slug}`} data-reveal className="group flex flex-col gap-4">
              <div className={`ink-card relative aspect-[3/2] overflow-hidden rounded-2xl bg-[#dbe9de] ${["-rotate-1", "rotate-1"][i % 2]}`}>
                {post.image ? (
                  <Image src={post.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className={`${display} flex size-full items-center justify-center p-6 text-center text-2xl opacity-70`}>{post.title}</div>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{formatDate(post.date)}</span>
              <h3 className={`${display} text-2xl leading-snug transition group-hover:text-[#3f6f5c]`}>{post.title}</h3>
              <p className="line-clamp-3 text-sm leading-relaxed opacity-75">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

    </Shell>
  );
}
