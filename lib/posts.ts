import postsJson from "@/content/posts.json";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string | null;
  original: string;
  html: string;
}

/** All blog posts, newest first (copied from the old edu-play.com.au blog). */
export const posts: Post[] = (postsJson as Post[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** The three latest posts, shaped for the home page cards. */
export const homePosts = posts.slice(0, 3).map((p) => ({
  href: `/news/${p.slug}`,
  title: p.title,
  excerpt: p.excerpt,
  image: p.image,
}));

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
