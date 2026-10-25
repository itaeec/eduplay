// Fetches the centre's latest public Facebook posts at build time and writes
// them to public/facebook.json, which the site reads on the client. Runs as
// the `prebuild` script; needs FACEBOOK_PAGE_TOKEN (see .env.local.example).
import { mkdir, writeFile } from "node:fs/promises";

const PAGE_ID = process.env.FACEBOOK_PAGE_ID ?? "61554037197376";
const TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
const OUT = new URL("../public/facebook.json", import.meta.url);

const write = async (payload) => {
  await mkdir(new URL("../public/", import.meta.url), { recursive: true });
  await writeFile(OUT, JSON.stringify({ ...payload, fetched: new Date().toISOString() }, null, 2));
};

if (!TOKEN) {
  await write({ posts: [], reason: "no-token" });
  console.log("facebook: no FACEBOOK_PAGE_TOKEN set, wrote empty feed");
  process.exit(0);
}

const url = new URL(`https://graph.facebook.com/v21.0/${PAGE_ID}/posts`);
url.searchParams.set("fields", "id,message,full_picture,permalink_url,created_time");
url.searchParams.set("limit", "9");
url.searchParams.set("access_token", TOKEN);

try {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  const posts = (json.data ?? [])
    .filter((p) => p.message || p.full_picture)
    .map((p) => ({
      id: p.id,
      message: p.message ?? null,
      picture: p.full_picture ?? null,
      permalink: p.permalink_url,
      created: p.created_time,
    }));
  await write({ posts });
  console.log(`facebook: wrote ${posts.length} posts`);
} catch (err) {
  await write({ posts: [], reason: err instanceof Error ? err.message : String(err) });
  console.warn("facebook: fetch failed —", err instanceof Error ? err.message : err);
}
