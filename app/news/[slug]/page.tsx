import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Blob, COLORS, display, Floater, Section, Shell, TourBand } from "@/components/site-chrome";
import { BASE_PATH } from "@/lib/base-path";
import { formatDate, getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: `${post.title} | Edu-Play Early Learning`, description: post.excerpt } : {};
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <PostBody params={params} />
    </Suspense>
  );
}

async function PostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <Shell>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7eadb_0%,#fbf1e4_60%,#fbf6ec_100%)] pt-28 sm:pt-36">
        <Blob className="-right-40 top-0 size-[28rem] bg-[#f3b46b]/30" />
        <Floater kind="kookaburra" className="right-[4%] top-[20%] w-28" distance={60} rotate={5} />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-10 sm:px-6">
          <Link href="/news" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#3f6f5c]">
            <ArrowLeft className="size-4" /> All news
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{formatDate(post.date)}</span>
          <h1 className={`${display} text-balance text-4xl leading-[1.05] sm:text-5xl`}>{post.title}</h1>
        </div>
        {post.image && (
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <div data-reveal data-lightbox={post.image} data-lightbox-alt={post.title} className="tape ink-card relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-white">
              <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </section>

      <Section bg={COLORS.cream} next={COLORS.sand}>
        <article className="prose-ink mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: post.html.replaceAll('src="/images/', `src="${BASE_PATH}/images/`) }} />
      </Section>

      <Section bg={COLORS.sand}>
        <h2 className={`${display} text-3xl`}>More from our centre</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {more.map((p) => (
            <Link key={p.slug} href={`/news/${p.slug}`} data-reveal className="ink-card flex flex-col gap-2 rounded-2xl bg-[#fffdf8] p-5">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{formatDate(p.date)}</span>
              <h3 className={`${display} text-xl leading-snug`}>{p.title}</h3>
            </Link>
          ))}
        </div>
      </Section>

      <TourBand animal="cockatoo" />
    </Shell>
  );
}
