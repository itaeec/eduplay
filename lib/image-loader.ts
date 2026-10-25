import manifest from "@/lib/photo-manifest.json";

// Serves the pre-built widths from scripts/images.mjs. Centre photos live at
// /images/photos/<width>/<name>.jpg; anything else is returned as-is.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const photos = new Set(manifest.photos);
const widths = manifest.widths;

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const m = src.match(/^\/images\/([^/]+)\.jpg$/);
  if (m && photos.has(m[1])) {
    const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
    return `${BASE_PATH}/images/photos/${w}/${m[1]}.jpg`;
  }
  return src.startsWith("/") && !src.startsWith(BASE_PATH + "/") ? BASE_PATH + src : src;
}
