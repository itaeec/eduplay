// Builds the web copies of the centre photos from the originals in img/.
//   npm run images
//
// For each photo it:
//  1. measures how crisp the original is (edge contrast at a fixed size),
//  2. picks the sharpen / soften amount that pulls it towards the set's
//     typical crispness, so soft rooms and crunchy outdoor shots look even,
//  3. writes responsive widths to public/images/photos/<w>/<name>.jpg (the
//     image loader picks the right one per slot) and a 3000px copy to
//     public/images/full/<name>.jpg for the full-screen viewer,
//  4. writes lib/photo-manifest.json listing what was built.
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCES = {
  "Outside/DSC06260-HDR.jpg": "outside-sandpit",
  "Outside/DSC06266-HDR.jpg": "outside-verandah",
  "Outside/DSC06269-HDR.jpg": "outside-yard",
  "Outside/DSC06272-HDR.jpg": "outside-climbing",
  "Outside/DSC06275-HDR.jpg": "outside-tent-table",
  "Outside/DSC06284-HDR.jpg": "outside-tables-swing",
  "Outside/DSC06287-HDR.jpg": "front-sign",
  "Outside/DSC06290-HDR.jpg": "front-building",
  "Room - Joeys/DSC06177-HDR.jpg": "joeys-easel",
  "Room - Joeys/DSC06182-HDR.jpg": "joeys-nature",
  "Room - Joeys/DSC06187-HDR.jpg": "joeys-playdough",
  "Room - Joeys/DSC06192-HDR.jpg": "joeys-books",
  "Room - Joeys/DSC06202-HDR.jpg": "joeys-blue-wall",
  "Room - Kangaroos/DSC06207-HDR.jpg": "kangaroos-nature-table",
  "Room - Kangaroos/DSC06217-HDR.jpg": "kangaroos-rug",
  "Room - Kangaroos/DSC06222-HDR.jpg": "kangaroos-home-corner",
  "Room - Kangaroos/DSC06232-HDR.jpg": "kangaroos-reading-nook",
  "Room - Kangaroos/DSC06247-HDR.jpg": "kangaroos-tea-table",
  "Room - Kangaroos/DSC06252-HDR.jpg": "kangaroos-main-room",
  "Veggies.jpg": "veggies-herbs",
};

/** Widths generated for the page; keep in sync with next.config.ts. */
export const WIDTHS = [480, 960, 1440, 2000];
const FULL_WIDTH = 3000;

/**
 * One dial from -1 (soften) to +1 (sharpen). Small values do almost nothing,
 * so the search can land anywhere in between rather than on fixed steps.
 */
const LOSSLESS = { compressionLevel: 0 };
const adjust = async (buf, t) => {
  if (t > 0) return sharp(buf).sharpen({ sigma: 0.8, m1: 1.4 * t, m2: 3 * t }).png(LOSSLESS).toBuffer();
  if (t < 0) {
    // blend a blurred copy over the original at strength |t|
    const blurred = await sharp(buf).blur(1).ensureAlpha(-t).png(LOSSLESS).toBuffer();
    const mixed = await sharp(buf).composite([{ input: blurred }]).png(LOSSLESS).toBuffer();
    return sharp(mixed).removeAlpha().png(LOSSLESS).toBuffer();
  }
  return buf;
};
const describe = (t) => (Math.abs(t) < 0.005 ? "unchanged" : t < 0 ? `softened ${(-t).toFixed(2)}` : `sharpened ${t.toFixed(2)}`);
const TOLERANCE = 0.08; // within ±8% of target → leave the photo alone

/** Variance of the Laplacian: higher = more fine edge contrast. */
async function crispness(buffer) {
  const lap = await sharp(buffer)
    .removeAlpha()
    .greyscale()
    .convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] })
    .raw()
    .toBuffer();
  let s = 0;
  let s2 = 0;
  for (const v of lap) {
    s += v;
    s2 += v * v;
  }
  const m = s / lap.length;
  return s2 / lap.length - m * m;
}

// Decode each original once, at the largest size we need.
const masters = {};
for (const [src, name] of Object.entries(SOURCES)) {
  masters[name] = await sharp(`img/${src}`).rotate().resize({ width: FULL_WIDTH, withoutEnlargement: true, kernel: "lanczos3" }).png(LOSSLESS).toBuffer();
}

// Pull every photo halfway (in log terms) towards the set's median crispness:
// evens out the obvious outliers without flattening genuinely detailed scenes.
const base = {};
for (const name of Object.values(SOURCES)) base[name] = await crispness(masters[name]);
const sorted = Object.values(base).sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];

await rm("public/images/photos", { recursive: true, force: true });
for (const w of WIDTHS) await mkdir(`public/images/photos/${w}`, { recursive: true });
await mkdir("public/images/full", { recursive: true });

const manifest = {};
let total = 0;
for (const name of Object.values(SOURCES)) {
  const target = Math.exp((Math.log(base[name]) + Math.log(median)) / 2);
  let t = 0;
  let tuned = masters[name];
  const off = Math.log(base[name] / target);
  if (Math.abs(off) > TOLERANCE) {
    // binary search the dial towards the target crispness
    let lo = off > 0 ? -1 : 0;
    let hi = off > 0 ? 0 : 1;
    for (let k = 0; k < 7; k++) {
      t = (lo + hi) / 2;
      tuned = await adjust(masters[name], t);
      const c = await crispness(tuned);
      if (c > target) hi = t;
      else lo = t;
    }
  }


  const write = async (path, width, quality) => {
    await sharp(tuned)
      .resize({ width, withoutEnlargement: true, kernel: "lanczos3" })
      // a light touch after shrinking keeps small sizes from going mushy
      .sharpen(width <= 960 ? { sigma: 0.45, m1: 0.4, m2: 1.5 } : undefined)
      .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(path);
    total += (await stat(path)).size;
  };
  for (const w of WIDTHS) await write(`public/images/photos/${w}/${name}.jpg`, w, w <= 960 ? 80 : 82);
  await write(`public/images/full/${name}.jpg`, FULL_WIDTH, 86);

  manifest[name] = { adjust: describe(t) };
  const after = await crispness(tuned);
  console.log(
    `${name.padEnd(24)} crisp ${String(Math.round(base[name])).padStart(5)} → ${String(Math.round(after)).padStart(5)}  target ${String(Math.round(target)).padStart(5)}  (${describe(t)})`,
  );
}

await writeFile(
  "lib/photo-manifest.json",
  JSON.stringify({ widths: WIDTHS, photos: Object.keys(manifest).sort() }, null, 2) + "\n",
);
console.log(`\nmedian crispness ${Math.round(median)} · total ${(total / 1024 / 1024).toFixed(1)} MB`);
