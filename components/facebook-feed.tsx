"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { withBase } from "@/lib/base-path";
import { FacebookIcon, InkAnimal } from "@/components/site-chrome";
import { links } from "@/lib/site-content";

export interface FacebookPost {
  id: string;
  message: string | null;
  picture: string | null;
  permalink: string;
  created: string;
}

const display = "font-[family-name:var(--font-display)]";
const tints = ["bg-[#f3b46b]", "bg-[#9ccbb5]", "bg-[#efb8ad]", "bg-[#9ab9c9]"];

type State = { status: "loading" } | { status: "ready"; posts: FacebookPost[] } | { status: "empty" };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

/**
 * Latest posts from the centre's Facebook page, read from /facebook.json which
 * scripts/fetch-facebook.mjs writes at build time. Falls back to a follow card
 * when no token is configured or the page has no public posts.
 */
export function FacebookFeed({ limit = 6 }: { limit?: number }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(withBase("/facebook.json"))
      .then((r) => r.json())
      .then((json: { posts?: FacebookPost[] }) => {
        if (cancelled) return;
        const posts = (json.posts ?? []).slice(0, limit);
        setState(posts.length ? { status: "ready", posts } : { status: "empty" });
      })
      .catch(() => !cancelled && setState({ status: "empty" }));
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (state.status === "loading") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="ink-card h-72 animate-pulse rounded-3xl bg-[#fffdf8]/70" />
        ))}
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="ink-card mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-[#fffdf8] p-8 text-center">
        <InkAnimal kind="kookaburra" className="w-24 animate-bob" />
        <h3 className={`${display} text-2xl`}>Follow us for daily updates</h3>
        <p className="leading-relaxed opacity-80">
          Our latest excursions, projects and centre news are posted on Facebook.
        </p>
        <a
          href={links.facebook}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#1b1714] bg-[#1877f2] px-6 py-3 text-sm font-bold text-white shadow-[3px_3px_0_#1b1714] transition hover:-translate-y-0.5"
        >
          <FacebookIcon className="size-4" /> Visit our Facebook page
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {state.posts.map((post, i) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noreferrer"
          className="ink-card group flex flex-col overflow-hidden rounded-3xl bg-[#fffdf8]"
        >
          {post.picture ? (
            <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-[#1b1714]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.picture} alt="" className="size-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
          ) : (
            <div className={`flex items-center gap-2 border-b-2 border-[#1b1714] px-5 py-3 ${tints[i % 4]}`}>
              <FacebookIcon className="size-4" />
              <span className="text-xs font-bold uppercase tracking-[0.16em]">Facebook</span>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f6f5c]">{formatDate(post.created)}</span>
            {post.message && <p className="line-clamp-5 whitespace-pre-line leading-relaxed opacity-85">{post.message}</p>}
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold">
              View on Facebook <ExternalLink className="size-3.5" />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
