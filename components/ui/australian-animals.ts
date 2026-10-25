// Ink-and-wash Australian animals (all facing right), drawn as layered SVG
// parts so legs, tails and wings can be animated independently on canvas.
//
// Style: bold ink linework over flat, warm colour washes. Far-side limbs use
// the animal's shade colour, near limbs its main colour, and dark animals
// carry pale detail lines (in the spirit of lino-print wildlife illustration).

export type Gait = "walk" | "waddle" | "hop" | "crawl";

export type AnimalKind =
  | "kangaroo"
  | "emu"
  | "koala"
  | "wombat"
  | "devil"
  | "echidna"
  | "platypus"
  | "kookaburra"
  | "cockatoo"
  | "bilby"
  | "dingo"
  | "goanna";

export interface AnimalPart {
  svg: string;
  /** Rotation pivot in viewBox units. Parts without a pivot never move. */
  pivot?: [number, number];
  /** Peak rotation in radians (negative swings the opposite way). */
  amp?: number;
  /** Offset within the gait cycle, 0–1. */
  phase?: number;
}

export interface AnimalDef {
  kind: AnimalKind;
  /** viewBox width; the feet rest on y = vh. */
  vw: number;
  vh: number;
  /** On-screen height in px at scale 1. */
  height: number;
  gait: Gait;
  /** Ground speed in px/s at scale 1. */
  speed: number;
  /** Seconds per stride / hop. */
  cycle: number;
  /** Hop height (hop gait) or body bob (other gaits) as a fraction of height. */
  bounce: number;
  parts: AnimalPart[];
}

export const INK = "#1b1714";
export const PAPER = "#fffdf8";
const PAD = 8;

// Shared wash colours
const OCHRE = "#d9a06b";
const OCHRE_DARK = "#b47a48";
const CREAM = "#f6e7cf";
const BROWN = "#8a6a4f";
const BROWN_DARK = "#5e4634";
const GREY = "#aab1b7";
const GREY_DARK = "#7c858c";
const GREY_LIGHT = "#e4e8ea";
const SAND = "#e2b887";
const SAND_DARK = "#b98a5a";
const YELLOW = "#f3c64a";
const SKY = "#9ab9c9";
const PINK = "#efb8ad";
const OLIVE = "#9a9668";
const OLIVE_DARK = "#5c5a3b";

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------

const shape = (d: string, fill: string, sw = 3.5) =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const ink = (d: string, sw = 3.5) => shape(d, INK, sw);
const paper = (d: string, sw = 3.5) => shape(d, PAPER, sw);
const line = (d: string, sw = 2, color = INK) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const white = (d: string, sw = 1.8) => line(d, sw, PAPER);
/** Unstroked flat colour, for highlights sitting inside an outlined shape. */
const flat = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
const eye = (cx: number, cy: number, r = 3.2) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.32}" fill="${PAPER}"/>`;
const whiteEye = (cx: number, cy: number, r = 3.4) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAPER}"/><circle cx="${cx + r * 0.2}" cy="${cy}" r="${r * 0.55}" fill="${INK}"/>`;
const clip = (id: string, d: string, body: string) =>
  `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g>`;

/** Deterministic pseudo-random so every render draws identical fur. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/** Circle with a scalloped, fluffy edge (koala ears). */
const fluffy = (cx: number, cy: number, r: number, n = 11, bump = 4) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) {
      d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      const m = a - Math.PI / n;
      const qx = cx + (r + bump) * Math.cos(m);
      const qy = cy + (r + bump) * Math.sin(m);
      d += ` Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d + " Z";
};

/** Rows of short strokes, used for fur, feathers and scales. */
const hatch = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  gapX: number,
  gapY: number,
  stroke: (x: number, y: number) => string,
) => {
  const out: string[] = [];
  let row = 0;
  for (let y = y0; y <= y1; y += gapY, row++) {
    for (let x = x0 + (row % 2) * (gapX / 2); x <= x1; x += gapX) {
      out.push(stroke(x, y));
    }
  }
  return out.join(" ");
};

// ---------------------------------------------------------------------------
// Kangaroo
// ---------------------------------------------------------------------------

const kangarooBody = (() => {
  const torso =
    "M58 168 C50 138 62 106 90 88 C106 78 124 80 132 92 C140 104 138 118 132 130 C124 148 110 164 96 176 C82 188 64 184 58 168 Z";
  return [
    shape("M120 108 C128 116 134 124 137 133 C135 136 131 135 129 131 C125 124 119 119 114 115 Z", OCHRE_DARK),
    shape(torso, OCHRE),
    flat("M96 100 C112 92 128 100 128 118 C124 140 110 160 96 172 C88 166 86 150 90 134 C92 120 92 108 96 100 Z", CREAM),
    line("M122 118 C116 138 106 154 94 166"),
    line("M98 100 l-4 6 M108 94 l-3 6 M86 112 l-5 5", 1.6),
    shape(
      "M125 94 C121 78 131 64 146 62 C157 60 167 64 177 72 C185 78 184 87 175 89 C165 91 155 92 147 99 C137 107 127 106 125 94 Z",
      OCHRE,
    ),
    shape("M146 64 C145 48 150 36 158 30 C161 42 158 54 152 64 Z", OCHRE_DARK),
    shape("M137 67 C130 52 130 38 136 28 C145 38 147 52 144 64 Z", OCHRE),
    flat("M137 56 C134 48 134 40 137 34 C141 40 142 48 141 58 Z", PINK),
    eye(157, 74, 3),
    `<circle cx="180" cy="80" r="2.6" fill="${INK}"/>`,
    line("M170 88 C166 90 162 90 158 89", 1.6),
    shape("M118 104 C128 112 136 122 140 132 C138 135 134 134 132 131 C126 122 118 117 112 113 Z", OCHRE),
  ].join("");
})();

const kangaroo: AnimalDef = {
  kind: "kangaroo",
  vw: 200,
  vh: 222,
  height: 190,
  gait: "hop",
  speed: 88,
  cycle: 0.95,
  bounce: 0.24,
  parts: [
    {
      svg: shape(
        "M66 162 C62 142 92 140 98 158 C102 172 96 188 88 200 L126 211 C133 213 132 221 125 221 L80 219 C70 218 66 210 70 200 C64 190 64 176 66 162 Z",
        OCHRE_DARK,
      ),
      pivot: [82, 160],
      amp: 0.5,
    },
    {
      svg:
        shape(
          "M70 152 C46 170 24 188 6 204 C2 208 4 213 10 210 C32 196 56 182 80 170 Z",
          OCHRE,
        ) + line("M40 182 C30 190 20 198 12 204", 1.6),
      pivot: [72, 160],
      amp: -0.16,
    },
    { svg: kangarooBody },
    {
      svg:
        shape(
          "M58 164 C54 138 90 132 102 150 C110 164 104 182 94 194 L138 206 C146 208 146 218 138 218 L88 218 C74 218 68 208 72 196 C62 186 58 178 58 164 Z",
          OCHRE,
        ) +
        line("M78 172 C84 182 88 190 92 196", 1.8) +
        line("M128 218 l2 3 M134 218 l2 3", 1.6),
      pivot: [80, 160],
      amp: 0.5,
    },
  ],
};

// ---------------------------------------------------------------------------
// Emu
// ---------------------------------------------------------------------------

const emuBodyPath =
  "M18 116 C14 86 40 66 78 64 C108 62 130 76 134 100 C138 124 120 146 92 154 C70 160 52 160 40 156 C30 158 22 154 22 146 C18 138 18 128 18 116 Z";

const emuBody = (() => {
  const rand = seeded(7);
  const feathers = hatch(14, 70, 136, 158, 9, 7, (x, y) => {
    const j = (rand() - 0.5) * 3;
    return `M${(x + j).toFixed(1)} ${y} c-1.5 3 -3 6 -6 9`;
  });
  let fringe = "M26 150";
  for (let x = 30; x <= 124; x += 6) {
    fringe += ` L${x} ${148 + (x % 12 === 0 ? 20 : 12) - (x > 100 ? 6 : 0)} L${x + 3} ${150}`;
  }
  fringe += " Z";
  return [
    shape(fringe, BROWN_DARK, 2),
    shape(emuBodyPath, BROWN_DARK),
    clip("emu-feathers", emuBodyPath, line(feathers, 1.5, CREAM)),
    line("M114 84 C120 62 118 40 124 22", 17),
    line("M114 84 C120 62 118 40 124 22", 10, SKY),
    line("M117 70 l5 -1 M118 58 l5 -1 M119 46 l5 -1 M121 34 l5 -1", 1.6),
    shape("M112 18 C114 3 136 1 143 12 C155 14 163 17 167 21 C163 25 151 25 143 27 C135 35 112 33 112 18 Z", SKY, 3),
    flat("M143 13 C154 15 162 18 166 21 C162 24 152 25 144 26 Z", INK),
    eye(131, 14, 2.8),
  ].join("");
})();

const emuLeg = (stroke: string) =>
  line("M76 148 L84 196 L80 238 M80 238 L94 242 M80 238 L68 242 M80 238 L88 243", 6, INK) +
  line("M76 148 L84 196 L80 238 M80 238 L94 242 M80 238 L68 242 M80 238 L88 243", 3, stroke);

const emu: AnimalDef = {
  kind: "emu",
  vw: 170,
  vh: 242,
  height: 200,
  gait: "walk",
  speed: 62,
  cycle: 0.95,
  bounce: 0.02,
  parts: [
    { svg: emuLeg(BROWN_DARK), pivot: [78, 148], amp: 0.38, phase: 0.5 },
    { svg: emuBody },
    { svg: emuLeg(GREY_DARK), pivot: [78, 148], amp: 0.38 },
  ],
};

// ---------------------------------------------------------------------------
// Koala
// ---------------------------------------------------------------------------

const koalaLeg = (dx: number, fill: string) => {
  const d = `M${22 + dx} 100 L${22 + dx} 122 C${22 + dx} 127 ${26 + dx} 128 ${32 + dx} 128 L${42 + dx} 128 C${44 + dx} 124 ${40 + dx} 122 ${38 + dx} 120 L${40 + dx} 102 Z`;
  return shape(d, fill) + line(`M${30 + dx} 128 l0 3 M${35 + dx} 128 l0 3 M${40 + dx} 128 l0 3`, 1.6);
};

const koalaBody = [
  shape("M20 96 C14 68 40 50 80 50 C112 50 132 64 134 88 C136 108 120 116 90 116 L44 116 C28 116 22 108 20 96 Z", GREY),
  flat("M40 100 C44 86 70 82 96 90 C110 96 116 106 112 112 L44 114 C38 110 38 104 40 100 Z", GREY_LIGHT),
  line("M38 64 l3 4 M54 58 l2 5 M72 56 l1 5 M92 57 l-1 5 M26 84 l5 1 M26 98 l5 -1", 1.6),
  line("M48 116 C70 120 96 120 118 112", 1.6),
  shape(fluffy(112, 32, 17, 12, 4), GREY),
  flat("M104 32 C104 24 118 22 120 32 C120 40 106 42 104 32 Z", GREY_LIGHT),
  shape(fluffy(170, 32, 17, 12, 4), GREY),
  flat("M162 32 C162 24 176 22 178 32 C178 40 164 42 162 32 Z", GREY_LIGHT),
  shape("M108 56 C106 36 122 22 141 22 C162 22 176 36 176 56 C176 74 160 86 141 86 C122 86 110 74 108 56 Z", GREY),
  flat("M118 62 C120 54 134 54 141 58 C150 54 164 56 166 64 C166 76 156 84 141 84 C126 84 118 74 118 62 Z", GREY_LIGHT),
  line("M114 76 l-3 4 M120 82 l-2 4 M164 78 l3 4", 1.4),
  ink("M133 50 C133 42 149 42 149 50 L150 64 C150 74 132 74 132 64 Z"),
  `<ellipse cx="137" cy="52" rx="2" ry="4" fill="${PAPER}"/>`,
  eye(124, 52, 3),
  eye(158, 52, 3),
  line("M134 79 C138 81 144 81 148 79", 1.6),
].join("");

const koala: AnimalDef = {
  kind: "koala",
  vw: 182,
  vh: 131,
  height: 92,
  gait: "waddle",
  speed: 26,
  cycle: 0.8,
  bounce: 0.02,
  parts: [
    { svg: koalaLeg(14, GREY_DARK), pivot: [46, 102], amp: 0.32, phase: 0.5 },
    { svg: koalaLeg(82, GREY_DARK), pivot: [114, 102], amp: 0.32 },
    { svg: koalaBody },
    { svg: koalaLeg(0, GREY), pivot: [32, 102], amp: 0.32 },
    { svg: koalaLeg(94, GREY), pivot: [126, 102], amp: 0.32, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Wombat
// ---------------------------------------------------------------------------

const stubLeg = (x: number, top: number, bottom: number, fill: string, w = 16) => {
  const d = `M${x} ${top} L${x} ${bottom - 6} C${x} ${bottom - 1} ${x + 4} ${bottom} ${x + 10} ${bottom} L${x + w + 2} ${bottom} C${x + w + 4} ${bottom - 4} ${x + w} ${bottom - 6} ${x + w - 2} ${bottom - 8} L${x + w} ${top} Z`;
  return (
    shape(d, fill) +
    line(`M${x + 8} ${bottom} l0 3 M${x + 13} ${bottom} l0 3 M${x + 18} ${bottom} l1 3`, 1.6)
  );
};

const wombatBody = [
  shape("M14 78 C8 44 42 20 92 18 C136 16 166 34 172 58 C176 74 172 90 160 98 L40 100 C24 100 16 92 14 78 Z", BROWN),
  flat("M30 80 C36 64 70 58 110 64 C140 70 156 82 154 96 L40 98 C30 96 26 88 30 80 Z", SAND),
  line("M40 36 l2 5 M60 28 l1 5 M82 25 l0 5 M104 24 l-1 5 M126 26 l-2 5 M20 66 l5 1 M20 82 l5 -1", 1.6),
  line("M44 98 C80 104 120 104 150 98", 1.6),
  line("M30 54 C36 60 38 70 36 80", 1.6),
  shape("M152 44 C150 32 156 28 162 36 Z", BROWN, 3),
  shape("M166 38 C168 28 176 28 176 40 Z", BROWN, 3),
  shape("M146 50 C156 36 180 38 186 58 C190 74 182 88 166 90 C152 92 140 80 140 66 Z", BROWN),
  flat("M156 70 C160 62 176 62 182 70 C184 80 176 88 166 88 C158 86 154 78 156 70 Z", SAND),
  ink("M179 58 C186 56 191 62 189 70 C186 74 180 72 178 66 Z", 2.5),
  eye(166, 60, 2.8),
  line("M172 82 C176 84 180 82 182 78 M160 74 l-6 2 M162 78 l-5 4", 1.4),
].join("");

const wombat: AnimalDef = {
  kind: "wombat",
  vw: 194,
  vh: 119,
  height: 76,
  gait: "waddle",
  speed: 34,
  cycle: 0.6,
  bounce: 0.03,
  parts: [
    { svg: stubLeg(46, 88, 116, BROWN_DARK), pivot: [54, 90], amp: 0.3, phase: 0.5 },
    { svg: stubLeg(134, 86, 116, BROWN_DARK), pivot: [142, 88], amp: 0.3 },
    { svg: wombatBody },
    { svg: stubLeg(26, 88, 118, BROWN), pivot: [34, 90], amp: 0.3 },
    { svg: stubLeg(146, 88, 118, BROWN), pivot: [154, 90], amp: 0.3, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Tasmanian devil
// ---------------------------------------------------------------------------

const devilBody = [
  ink("M16 62 C2 58 -2 72 4 80 C10 82 16 76 20 70 Z"),
  ink("M12 70 C10 42 40 26 80 26 C118 26 140 40 146 60 C150 76 144 90 130 94 L44 96 C24 96 14 88 12 70 Z"),
  white("M44 36 C50 46 50 58 44 66", 5),
  white("M30 46 l-3 -3 M64 32 l-1 -4 M92 30 l0 -4 M114 34 l2 -4", 1.4),
  flat("M116 52 C128 60 132 74 126 90 L116 92 C120 78 118 64 110 56 Z", PAPER),
  shape("M136 40 C128 26 140 20 148 32 Z", INK, 3),
  flat("M139 34 C139 30 144 29 145 33 Z", PINK),
  shape("M154 34 C156 22 168 22 166 38 Z", INK, 3),
  flat("M157 32 C158 27 163 27 163 32 Z", PINK),
  ink("M128 48 C138 30 164 32 172 50 C178 62 174 76 162 80 C148 84 132 76 128 64 Z"),
  whiteEye(158, 50, 3.6),
  `<ellipse cx="173" cy="58" rx="3.5" ry="3" fill="${PINK}"/>`,
  white("M160 72 C166 74 170 72 174 66", 1.8),
  white("M166 62 l12 -2 M166 66 l12 2", 1),
].join("");

const devil: AnimalDef = {
  kind: "devil",
  vw: 180,
  vh: 117,
  height: 70,
  gait: "walk",
  speed: 46,
  cycle: 0.55,
  bounce: 0.03,
  parts: [
    { svg: stubLeg(46, 84, 114, "#3a3230") + white("M48 88 C54 92 60 92 64 88", 1.4), pivot: [54, 86], amp: 0.38, phase: 0.5 },
    { svg: stubLeg(130, 84, 114, "#3a3230") + white("M132 88 C138 92 144 92 148 88", 1.4), pivot: [138, 86], amp: 0.38 },
    { svg: devilBody },
    { svg: stubLeg(26, 84, 117, INK) + white("M26 86 C32 90 38 90 44 86", 1.6), pivot: [34, 86], amp: 0.38 },
    { svg: stubLeg(114, 84, 117, INK) + white("M114 86 C120 90 126 90 132 86", 1.6), pivot: [122, 86], amp: 0.38, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Echidna
// ---------------------------------------------------------------------------

const echidnaBody = (() => {
  const rand = seeded(42);
  const cx = 82;
  const cy = 86;
  const quills: { k: number; svg: string }[] = [];
  for (let i = 0; i < 90; i++) {
    const a = Math.PI * (1.05 + rand() * 0.88);
    const k = 0.45 + rand() * 0.55;
    const bx = cx + 62 * k * Math.cos(a);
    const by = cy + 52 * k * Math.sin(a);
    // outward normal, swept back towards the tail
    let nx = Math.cos(a) / 62;
    let ny = Math.sin(a) / 52;
    const nl = Math.hypot(nx, ny);
    nx /= nl;
    ny /= nl;
    const t = -0.95;
    const dx = nx * Math.cos(t) - ny * Math.sin(t);
    const dy = nx * Math.sin(t) + ny * Math.cos(t);
    const len = 9 + rand() * 9 + k * 5;
    const px = -dy * 2.2;
    const py = dx * 2.2;
    const tip = `${(bx + dx * len).toFixed(1)} ${(by + dy * len).toFixed(1)}`;
    quills.push({
      k,
      svg: shape(
        `M${(bx - px).toFixed(1)} ${(by - py).toFixed(1)} L${tip} L${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} Z`,
        CREAM,
        1.3,
      ),
    });
  }
  quills.sort((a, b) => a.k - b.k);
  return [
    shape("M18 96 C14 62 44 38 82 36 C116 36 140 56 146 80 L148 98 Z", BROWN_DARK),
    ...quills.map((q) => q.svg),
    shape("M128 70 C140 66 152 74 154 86 C152 94 140 98 128 94 Z", BROWN),
    shape("M146 76 C160 78 174 84 186 94 C188 97 185 99 181 98 C168 95 156 92 146 90 Z", BROWN_DARK, 2.5),
    whiteEye(142, 78, 2.6),
  ].join("");
})();

const echidnaLeg = (x: number, fill: string) =>
  shape(`M${x} 90 L${x - 2} 104 L${x + 12} 104 L${x + 10} 90 Z`, fill, 2.5) +
  line(`M${x - 2} 104 l-3 2 M${x + 3} 104 l-1 3 M${x + 8} 104 l1 3`, 1.4);

const echidna: AnimalDef = {
  kind: "echidna",
  vw: 190,
  vh: 106,
  height: 54,
  gait: "waddle",
  speed: 22,
  cycle: 0.5,
  bounce: 0.02,
  parts: [
    { svg: echidnaLeg(42, BROWN_DARK), pivot: [47, 92], amp: 0.4, phase: 0.5 },
    { svg: echidnaLeg(118, BROWN_DARK), pivot: [123, 92], amp: 0.4 },
    { svg: echidnaBody },
    { svg: echidnaLeg(28, BROWN), pivot: [33, 92], amp: 0.4 },
    { svg: echidnaLeg(104, BROWN), pivot: [109, 92], amp: 0.4, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Platypus
// ---------------------------------------------------------------------------

const platypusBodyPath =
  "M40 46 C40 26 76 16 112 18 C140 20 160 30 162 44 C164 58 140 66 104 66 C70 66 40 62 40 46 Z";
const platypusTailPath = "M46 40 C24 30 2 36 2 48 C2 60 24 62 50 54 Z";

const platypusBody = [
  shape(platypusTailPath, BROWN_DARK),
  clip(
    "platypus-tail",
    platypusTailPath,
    line("M8 36 L36 62 M18 34 L44 58 M28 34 L50 52 M4 48 L22 34 M10 58 L34 36 M22 60 L46 40", 1.1, CREAM),
  ),
  shape(platypusBodyPath, BROWN),
  flat("M56 50 C70 44 110 44 150 50 C152 58 136 64 104 64 C72 64 54 58 56 50 Z", SAND),
  clip(
    "platypus-fur",
    platypusBodyPath,
    line(hatch(50, 26, 156, 46, 10, 8, (x, y) => `M${x} ${y} c-2 1 -4 3 -5 5`), 1.2, CREAM),
  ),
  shape("M154 34 C172 28 197 30 197 42 C197 54 172 56 154 50 Z", OCHRE),
  line("M158 42 C170 44 184 44 196 42", 1.4),
  `<circle cx="186" cy="35" r="1.4" fill="${INK}"/>`,
  whiteEye(146, 34, 2.6),
].join("");

const webFoot = (x: number, y: number, fill: string) =>
  shape(
    `M${x} ${y} L${x - 4} ${y + 12} L${x - 10} ${y + 17} L${x - 3} ${y + 18} L${x + 2} ${y + 15} L${x + 6} ${y + 20} L${x + 10} ${y + 15} L${x + 15} ${y + 18} L${x + 12} ${y + 12} L${x + 8} ${y} Z`,
    fill,
    2.5,
  );

const platypus: AnimalDef = {
  kind: "platypus",
  vw: 200,
  vh: 80,
  height: 40,
  gait: "waddle",
  speed: 26,
  cycle: 0.45,
  bounce: 0.02,
  parts: [
    { svg: webFoot(80, 58, OCHRE_DARK), pivot: [84, 58], amp: 0.5, phase: 0.5 },
    { svg: webFoot(146, 56, OCHRE_DARK), pivot: [150, 56], amp: 0.5 },
    { svg: platypusBody },
    { svg: webFoot(68, 60, OCHRE), pivot: [72, 60], amp: 0.5 },
    { svg: webFoot(134, 58, OCHRE), pivot: [138, 58], amp: 0.5, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Kookaburra
// ---------------------------------------------------------------------------

const kookaWingPath =
  "M30 74 C40 58 68 60 80 78 C84 94 72 108 54 110 C38 110 28 94 30 74 Z";
const kookaburraBody = [
  shape("M30 92 C18 104 10 118 6 132 L24 128 C32 114 40 104 46 96 Z", BROWN),
  flat("M22 108 C18 114 14 120 12 126 L20 124 C22 118 26 112 30 108 Z", SKY),
  line("M14 116 L28 120 M18 106 L32 110 M24 98 L36 102", 2.2),
  shape("M24 86 C20 62 40 46 66 46 C88 46 100 60 98 82 C96 104 80 116 58 116 C38 116 26 104 24 86 Z", CREAM),
  line("M70 90 C74 98 74 106 70 112 M80 84 C84 92 86 100 82 108", 1.2),
  shape(kookaWingPath, BROWN),
  clip(
    "kooka-wing",
    kookaWingPath,
    flat("M28 70 C36 64 46 66 52 78 C54 90 46 100 36 102 C30 96 26 84 28 70 Z", SKY) +
      line(hatch(30, 66, 84, 108, 9, 7, (x, y) => `M${x} ${y} q3 4 6 0`), 1.5, CREAM),
  ),
  shape("M64 50 C60 30 76 16 96 18 C112 20 120 32 118 46 C116 58 104 64 90 64 C76 64 66 60 64 50 Z", CREAM),
  flat("M70 34 C78 22 96 20 110 30 C114 36 112 40 108 40 C96 36 82 36 72 42 Z", BROWN),
  line("M72 26 l6 6 M80 21 l4 7 M88 19 l3 7 M96 19 l1 7 M104 21 l-1 7", 2),
  shape("M74 42 C86 36 100 37 114 41 L114 46 C100 43 88 44 76 47 Z", BROWN_DARK, 2),
  whiteEye(98, 41, 3.2),
  shape("M112 38 L150 46 L112 50 Z", INK, 2.5),
  shape("M112 50 L146 48 L114 57 Z", SAND, 2.5),
].join("");

const birdLeg = (x: number, top: number, bottom: number, color = INK) =>
  line(
    `M${x} ${top} L${x - 2} ${bottom} M${x - 2} ${bottom} l-7 1 M${x - 2} ${bottom} l7 1 M${x - 2} ${bottom} l-2 -4`,
    3,
    color,
  );

const kookaburra: AnimalDef = {
  kind: "kookaburra",
  vw: 152,
  vh: 136,
  height: 70,
  gait: "hop",
  speed: 34,
  cycle: 0.55,
  bounce: 0.14,
  parts: [
    { svg: birdLeg(60, 110, 135, GREY_DARK), pivot: [60, 110], amp: 0.3 },
    { svg: kookaburraBody },
    { svg: birdLeg(52, 112, 136), pivot: [52, 112], amp: 0.3 },
  ],
};

// ---------------------------------------------------------------------------
// Sulphur-crested cockatoo
// ---------------------------------------------------------------------------

const cockatooBody = [
  paper("M46 124 L30 154 L44 156 L62 130 Z"),
  flat("M40 134 L34 148 L42 150 L50 136 Z", YELLOW),
  line("M40 140 L50 136 M36 148 L46 144", 1.4),
  paper("M40 116 C30 92 36 62 60 52 C80 44 100 56 100 78 C100 100 90 120 74 130 C60 138 46 132 40 116 Z"),
  shape("M42 84 C52 70 72 74 78 92 C80 110 66 128 48 130 C40 120 38 100 42 84 Z", GREY_LIGHT),
  line("M48 96 C56 102 62 110 64 120 M46 108 C52 112 56 118 58 126 M54 86 C62 90 68 98 72 106", 1.6),
  shape(
    "M70 42 C64 30 58 18 50 6 C62 12 68 20 72 28 C72 18 72 8 77 0 C81 12 81 22 80 30 C84 22 90 14 99 9 C95 21 91 30 86 40 Z",
    YELLOW,
    3,
  ),
  line("M64 28 L70 38 M76 14 L77 32 M90 20 L84 34", 1.4),
  paper("M62 46 C64 32 80 26 92 32 C102 38 104 52 98 62 C92 70 76 70 68 64 C62 58 62 52 62 46 Z"),
  `<circle cx="84" cy="46" r="5" fill="${SKY}" stroke="${INK}" stroke-width="1.4"/>`,
  eye(84, 46, 2.6),
  shape("M96 48 C108 46 114 56 110 66 C106 72 100 70 98 64 C102 62 102 56 96 54 Z", GREY_DARK, 2.5),
  line("M96 56 C99 58 100 61 99 64", 1.4, PAPER),
].join("");

const cockatoo: AnimalDef = {
  kind: "cockatoo",
  vw: 120,
  vh: 156,
  height: 88,
  gait: "walk",
  speed: 28,
  cycle: 0.6,
  bounce: 0.03,
  parts: [
    { svg: birdLeg(70, 128, 155, GREY_DARK), pivot: [70, 128], amp: 0.35, phase: 0.5 },
    { svg: cockatooBody },
    { svg: birdLeg(62, 130, 156), pivot: [62, 130], amp: 0.35 },
  ],
};

// ---------------------------------------------------------------------------
// Bilby
// ---------------------------------------------------------------------------

const BILBY = "#b3bcc4";
const BILBY_DARK = "#86919a";

const bilbyBody = [
  ink("M100 98 L100 120 L110 122 L110 118 L106 116 L108 100 Z", 2.5),
  shape("M42 96 C26 104 14 110 2 110 C14 116 30 116 48 106 Z", BILBY),
  ink("M22 106 C14 108 8 110 2 110 C10 114 18 114 26 112 Z", 2),
  shape("M34 104 C24 80 40 54 72 50 C98 46 118 58 124 76 C128 92 118 110 98 114 L52 116 C42 116 36 112 34 104 Z", BILBY),
  flat("M46 100 C50 84 76 80 100 88 C112 94 116 106 110 112 L52 114 C44 110 44 104 46 100 Z", GREY_LIGHT),
  line("M50 62 l2 4 M66 56 l1 5 M84 54 l-1 5 M102 59 l-2 5", 1.6),
  shape("M110 66 C112 52 124 46 136 48 C148 52 158 62 168 74 C170 78 166 80 160 78 C150 76 138 80 128 82 C118 82 110 76 110 66 Z", BILBY),
  shape("M128 50 C130 32 138 16 148 10 C150 24 144 40 136 52 Z", BILBY_DARK, 3),
  shape("M118 54 C112 36 112 16 120 6 C128 18 130 36 128 50 Z", BILBY, 3),
  flat("M120 46 C116 34 116 20 121 12 C125 22 126 36 125 48 Z", PINK),
  eye(138, 62, 2.8),
  `<circle cx="167" cy="76" r="2" fill="${INK}"/>`,
  line("M156 72 l12 -6 M156 74 l12 0", 0.9),
].join("");

const bilby: AnimalDef = {
  kind: "bilby",
  vw: 172,
  vh: 124,
  height: 66,
  gait: "hop",
  speed: 46,
  cycle: 0.6,
  bounce: 0.16,
  parts: [
    { svg: bilbyBody },
    {
      svg:
        shape(
          "M44 92 C42 76 70 74 76 90 C80 100 76 108 72 114 L104 118 C110 118 110 124 104 124 L60 124 C50 124 48 116 50 110 C44 104 44 98 44 92 Z",
          BILBY,
        ) + line("M58 98 C62 104 66 110 70 114", 1.6),
      pivot: [60, 92],
      amp: 0.45,
    },
    {
      svg: shape("M108 96 L108 120 L118 122 L118 118 L114 116 L116 98 Z", BILBY, 2.5),
      pivot: [112, 98],
      amp: -0.4,
    },
  ],
};

// ---------------------------------------------------------------------------
// Dingo
// ---------------------------------------------------------------------------

const dingoLeg = (x: number, fill: string, back = false) => {
  const d = back
    ? `M${x} 90 C${x - 6} 108 ${x} 120 ${x - 4} 132 L${x - 6} 150 L${x + 6} 152 L${x + 6} 146 L${x + 6} 132 C${x + 10} 120 ${x + 12} 106 ${x + 10} 92 Z`
    : `M${x} 92 L${x + 2} 126 L${x + 2} 150 L${x + 14} 152 L${x + 12} 146 L${x + 10} 126 L${x + 12} 94 Z`;
  return shape(d, fill, 3) + flat(back ? `M${x - 5} 146 L${x - 6} 150 L${x + 6} 152 L${x + 6} 147 Z` : `M${x + 2} 146 L${x + 2} 150 L${x + 14} 152 L${x + 12} 146 Z`, PAPER);
};

const dingoBody = [
  shape("M38 74 C36 56 58 46 86 50 C112 54 136 46 156 52 C170 58 172 76 166 90 C160 102 148 104 136 98 C120 92 104 94 88 100 C68 106 42 98 38 74 Z", SAND),
  flat("M60 92 C76 86 98 86 124 90 C136 92 150 92 160 88 C156 98 146 102 136 98 C120 92 104 94 88 100 C76 104 66 100 60 92 Z", CREAM),
  line("M70 98 C90 94 112 90 134 94", 1.6),
  line("M62 58 l1 4 M86 56 l0 5 M110 56 l-1 5 M134 54 l-2 5", 1.6),
  line("M148 64 C156 72 160 82 160 92 M154 60 l4 6 M156 70 l4 6", 1.4),
  shape("M152 54 C150 40 160 28 172 26 C180 24 186 30 190 38 C196 42 200 46 198 51 C194 55 186 56 180 58 C172 64 158 66 152 54 Z", SAND),
  flat("M168 48 C176 44 186 46 194 50 C190 54 184 56 178 58 C172 60 164 56 168 48 Z", CREAM),
  shape("M166 32 L162 10 L178 26 Z", SAND, 3),
  flat("M167 26 L165 16 L173 24 Z", PINK),
  shape("M176 28 L182 8 L188 28 Z", SAND_DARK, 3),
  eye(180, 38, 2.6),
  `<circle cx="198" cy="48" r="2.6" fill="${INK}"/>`,
  line("M190 54 C186 56 182 56 178 55", 1.4),
].join("");

const dingo: AnimalDef = {
  kind: "dingo",
  vw: 202,
  vh: 152,
  height: 100,
  gait: "walk",
  speed: 70,
  cycle: 0.72,
  bounce: 0.025,
  parts: [
    { svg: dingoLeg(62, SAND_DARK, true), pivot: [66, 92], amp: 0.42, phase: 0.5 },
    { svg: dingoLeg(150, SAND_DARK), pivot: [156, 94], amp: 0.42 },
    {
      svg:
        shape("M44 66 C28 70 16 84 12 104 C10 116 16 120 22 114 C26 100 34 88 48 80 Z", SAND) +
        flat("M18 104 C18 110 18 114 22 114 C24 108 26 102 30 96 Z", PAPER) +
        line("M30 84 l-5 -2 M24 96 l-5 -1 M22 106 l-5 0 M36 76 l-4 -3", 1.4),
      pivot: [44, 72],
      amp: 0.18,
      phase: 0.25,
    },
    { svg: dingoBody },
    { svg: dingoLeg(48, SAND, true), pivot: [52, 92], amp: 0.42 },
    { svg: dingoLeg(136, SAND), pivot: [142, 94], amp: 0.42, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Lace monitor (goanna)
// ---------------------------------------------------------------------------

const goannaBodyPath =
  "M66 44 C66 30 96 26 130 28 C150 30 160 34 166 40 C170 46 160 50 140 52 L90 52 C76 52 66 50 66 44 Z";
const goannaTailPath = "M74 34 C50 34 26 40 2 48 C26 50 52 48 76 48 Z";

const goannaBody = [
  shape(goannaBodyPath, OLIVE),
  clip(
    "goanna-bands",
    goannaBodyPath,
    flat("M84 26 L92 26 L88 54 L80 54 Z M104 26 L112 26 L108 54 L100 54 Z M124 26 L132 26 L128 54 L120 54 Z M144 28 L150 28 L148 54 L140 54 Z", OLIVE_DARK) +
      `<g fill="${CREAM}">${hatch(70, 32, 162, 48, 6, 6, (x, y) => `<circle cx="${x}" cy="${y}" r="1"/>`)}</g>`,
  ),
  shape("M160 34 C172 28 190 28 202 32 C212 34 222 38 224 42 C220 46 206 48 192 48 C180 48 168 46 160 44 Z", OLIVE),
  line("M174 34 l4 8 M184 32 l3 8", 1.6),
  eye(204, 37, 2.2),
].join("");

const goannaLeg = (x: number, y: number, dir: 1 | -1, color: string) =>
  line(`M${x} ${y} L${x + dir * 10} ${y + 10} L${x + dir * 4} ${y + 20} M${x + dir * 4} ${y + 20} l${dir * 7} 1 M${x + dir * 4} ${y + 20} l${-dir * 6} 1`, 6, INK) +
  line(`M${x} ${y} L${x + dir * 10} ${y + 10} L${x + dir * 4} ${y + 20}`, 2.5, color);

const goanna: AnimalDef = {
  kind: "goanna",
  vw: 228,
  vh: 70,
  height: 36,
  gait: "crawl",
  speed: 32,
  cycle: 0.6,
  bounce: 0.01,
  parts: [
    { svg: goannaLeg(94, 48, -1, OLIVE_DARK), pivot: [94, 48], amp: 0.5, phase: 0.5 },
    { svg: goannaLeg(150, 46, 1, OLIVE_DARK), pivot: [150, 46], amp: 0.5 },
    {
      svg:
        shape(goannaTailPath, OLIVE) +
        clip("goanna-tail", goannaTailPath, flat("M58 34 L64 34 L62 50 L56 50 Z M38 38 L44 38 L42 50 L36 50 Z M20 42 L25 42 L24 50 L18 50 Z", OLIVE_DARK)),
      pivot: [72, 42],
      amp: 0.1,
      phase: 0.25,
    },
    { svg: goannaBody },
    { svg: goannaLeg(84, 48, -1, OLIVE), pivot: [84, 48], amp: 0.5 },
    { svg: goannaLeg(140, 46, 1, OLIVE), pivot: [140, 46], amp: 0.5, phase: 0.5 },
  ],
};

// ---------------------------------------------------------------------------

export const AUSTRALIAN_ANIMALS: Record<AnimalKind, AnimalDef> = {
  kangaroo,
  emu,
  koala,
  wombat,
  devil,
  echidna,
  platypus,
  kookaburra,
  cockatoo,
  bilby,
  dingo,
  goanna,
};

export const ALL_ANIMAL_KINDS = Object.keys(AUSTRALIAN_ANIMALS) as AnimalKind[];

/** Wraps SVG markup in a padded document matching the animal's viewBox. */
export const wrapSvg = (def: Pick<AnimalDef, "vw" | "vh">, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${def.vw + PAD * 2} ${def.vh + PAD * 2}" width="${def.vw + PAD * 2}" height="${def.vh + PAD * 2}">${body}</svg>`;

export const SVG_PAD = PAD;

/** The whole animal as a single standalone SVG string (for static use). */
export const animalSvg = (kind: AnimalKind) => {
  const def = AUSTRALIAN_ANIMALS[kind];
  return wrapSvg(def, def.parts.map((p) => p.svg).join(""));
};

export const animalDataUri = (kind: AnimalKind) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(animalSvg(kind))}`;
