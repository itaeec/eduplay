// Layered outback backdrop for the hero. Each layer carries `data-speed` so
// ScrollEffects can move it at its own rate (lower = further away).

const INK = "#1b1714";

/** A slender ghost gum drawn in the same ink style as the animals. */
function GumTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="animate-sway" style={{ transformOrigin: "0 0" }}>
        <path
          d="M-6 0 C-4 -40 -8 -80 -2 -120 C0 -132 4 -140 10 -150 M-3 -70 C-20 -90 -30 -100 -46 -108 M0 -100 C14 -112 28 -118 44 -126 M-1 -125 C-12 -138 -16 -150 -24 -160"
          fill="none"
          stroke={INK}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M-6 0 C-4 -40 -8 -80 -2 -120" fill="none" stroke="#fffdf8" strokeWidth="2" strokeLinecap="round" />
        {[
          [-50, -116, 30, 16, "#8fc3a8"],
          [-20, -168, 34, 18, "#9ccbb5"],
          [12, -158, 30, 17, "#7fb79a"],
          [44, -132, 32, 16, "#9ccbb5"],
          [-4, -140, 26, 14, "#b5dbc7"],
        ].map(([cx, cy, rx, ry, fill], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill as string} stroke={INK} strokeWidth="3" />
        ))}
        <path
          d="M-62 -116 l8 2 M-40 -110 l8 -2 M-30 -172 l8 2 M-8 -164 l8 -2 M4 -160 l8 2 M30 -134 l8 2 M50 -128 l8 -2"
          stroke={INK}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 160 60" className={className} style={style} aria-hidden="true">
      <path
        d="M20 50 C6 50 4 34 18 30 C18 16 36 10 46 20 C54 4 82 4 88 22 C100 14 118 20 116 34 C134 32 144 50 128 52 Z"
        fill="#fffdf8"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 40 C50 36 60 38 66 42 M86 36 C94 32 104 34 108 40" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Bird({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 20" className={className} style={style} aria-hidden="true">
      <g className="origin-center animate-flap" style={{ transformBox: "fill-box" }}>
        <path d="M2 8 C10 0 16 2 20 10 C24 2 30 0 38 8" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const grass = (() => {
  let d = "";
  for (let x = 0; x <= 1600; x += 22) {
    const h = 10 + ((x * 37) % 17);
    d += `M${x} 40 q2 ${-h / 2} ${-4 + ((x * 13) % 9)} ${-h} M${x + 6} 40 q1 ${-h / 2} ${3} ${-h * 0.7} `;
  }
  return d;
})();

export function OutbackScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sky: pale dawn with a warm band near the horizon */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7eadb_0%,#fbf1e4_38%,#f9dfc0_62%,#f3cfa6_100%)]" />
      <div className="absolute right-[-10%] top-[-10%] size-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(243,180,107,0.35),transparent)]" />

      {/* Sun with slowly turning rays */}
      <div data-speed="0.15" className="absolute right-[5%] top-[11%] size-24 opacity-70 sm:size-48 sm:opacity-100">
        <svg viewBox="0 0 200 200" className="size-full animate-[spin_80s_linear_infinite]">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M100 8 L100 30"
              stroke="#e9a35b"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${i * 22.5} 100 100)`}
              opacity="0.7"
            />
          ))}
        </svg>
        <div className="absolute inset-[22%] rounded-full bg-[#f3b46b] shadow-[0_0_80px_30px_rgba(243,180,107,0.35)]" />
      </div>

      {/* Drifting clouds and a flock of birds */}
      <div data-speed="0.25" className="absolute inset-x-0 top-[12%] hidden h-1/2 opacity-70 sm:block">
        <Cloud
          className="absolute left-0 top-[10%] w-40 animate-drift [animation-duration:70s] opacity-90"
          style={{ animationDelay: "-22s" }}
        />
        <Cloud
          className="absolute left-0 top-[36%] w-28 animate-drift [animation-duration:95s] opacity-80"
          style={{ animationDelay: "-62s" }}
        />
        <Cloud
          className="absolute left-0 top-[2%] w-24 animate-drift [animation-duration:120s] opacity-70"
          style={{ animationDelay: "-85s" }}
        />
        <div className="absolute left-0 top-[24%] animate-fly" style={{ animationDelay: "-12s" }}>
          <Bird className="w-9" />
          <Bird className="-mt-1 ml-10 w-7" style={{ animationDelay: "-0.3s" }} />
          <Bird className="-mt-5 ml-20 w-6" style={{ animationDelay: "-0.6s" }} />
        </div>
      </div>

      {/* Distant ranges */}
      <svg
        data-speed="0.3"
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[26%] h-[30%] w-full"
      >
        <path d="M0 260 C140 200 300 240 460 190 C620 140 760 220 920 180 C1100 130 1280 200 1600 150 L1600 400 L0 400 Z" fill="#e3ddd0" />
      </svg>

      {/* Far hills */}
      <svg
        data-speed="0.4"
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[22%] h-[38%] w-full"
      >
        <path d="M0 220 C200 140 380 180 560 130 C760 80 940 170 1120 120 C1300 70 1460 130 1600 110 L1600 400 L0 400 Z" fill="#d6e6d6" />
      </svg>

      {/* Mid hills with ghost gums */}
      <svg
        data-speed="0.55"
        viewBox="0 0 1600 420"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-[10%] h-[44%] w-full"
      >
        <path
          d="M0 260 C180 200 340 230 520 190 C700 150 860 230 1040 210 C1220 190 1400 140 1600 180 L1600 420 L0 420 Z"
          fill="#b9d8c4"
          stroke={INK}
          strokeWidth="3"
        />
        <path d="M0 300 C200 280 400 310 600 290 C800 270 1000 300 1200 285 C1400 270 1500 290 1600 280 L1600 420 L0 420 Z" fill="#a9cdb5" />
        <GumTree x={180} y={232} s={0.9} />
        <GumTree x={1180} y={200} s={1.1} flip />
        <GumTree x={1330} y={176} s={0.7} />
        <path d="M600 200 l10 -8 M640 196 l8 -10 M900 214 l10 -8 M940 212 l6 -10" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Sandy ground the animals walk on */}
      <div data-speed="0.8" className="absolute inset-x-0 bottom-0 h-[30%]">
        <svg viewBox="0 0 1600 120" preserveAspectRatio="none" className="absolute inset-x-0 -top-14 h-24 w-full">
          <path d="M0 70 C200 30 420 84 640 54 C880 22 1100 72 1340 40 C1460 26 1540 36 1600 46 L1600 120 L0 120 Z" fill="#f1dcbc" />
          <path
            d="M0 70 C200 30 420 84 640 54 C880 22 1100 72 1340 40 C1460 26 1540 36 1600 46"
            fill="none"
            stroke={INK}
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-0 top-9 bg-gradient-to-b from-[#f1dcbc] to-[#e9c99b]" />
      </div>
    </div>
  );
}

/** Ink grass tufts drawn in front of the animals. */
export function ForegroundGrass() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 40"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -bottom-1 h-8 w-full"
    >
      <path d={grass} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Wavy divider that sits on the seam between two sections. */
export function WaveDivider({
  fill,
  className = "",
  flip = false,
}: {
  fill: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 80"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-10 w-full sm:h-16 ${flip ? "-scale-y-100" : ""} ${className}`}
    >
      <path
        d="M0 80 L0 48 C160 20 320 70 520 44 C720 18 900 60 1100 40 C1300 20 1460 56 1600 36 L1600 80 Z"
        fill={fill}
      />
      <path
        d="M0 48 C160 20 320 70 520 44 C720 18 900 60 1100 40 C1300 20 1460 56 1600 36"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
