"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

import {
  ALL_ANIMAL_KINDS,
  AUSTRALIAN_ANIMALS,
  SVG_PAD,
  wrapSvg,
  type AnimalDef,
  type AnimalKind,
} from "@/components/ui/australian-animals";
import { cn } from "@/lib/utils";

interface CrowdCanvasProps {
  /** Which animals join the parade. Defaults to all of them. */
  animals?: AnimalKind[];
  /** How many animals are on screen at once. */
  count?: number;
  /** Speed multiplier. 1 is a relaxed stroll; lower is slower. */
  speed?: number;
  /** Size multiplier on top of the automatic viewport scaling. */
  scale?: number;
  /** Max px between the front and back rows of animals. */
  depthRange?: number;
  /**
   * Scroll parallax strength. Animals further back drift down by
   * scrollY × parallax × depth, so rows separate as the page scrolls.
   */
  parallax?: number;
  className?: string;
}

type Layer = {
  bitmap: HTMLCanvasElement;
  pivot?: [number, number];
  amp: number;
  phase: number;
};

type Sprite = { def: AnimalDef; layers: Layer[] };

type Walker = {
  sprite: Sprite;
  dir: 1 | -1;
  depth: number;
  height: number;
  /** px per viewBox unit */
  unit: number;
  startX: number;
  endX: number;
  feetY: number;
  velocity: number;
  cycle: number;
  elapsed: number;
  duration: number;
  x: number;
  lift: number;
  tilt: number;
};

const randomRange = (min: number, max: number) =>
  min + Math.random() * (max - min);

const loadSvg = (svg: string, def: AnimalDef, density: number) =>
  new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const bitmap = document.createElement("canvas");
      bitmap.width = Math.ceil((def.vw + SVG_PAD * 2) * density);
      bitmap.height = Math.ceil((def.vh + SVG_PAD * 2) * density);
      bitmap.getContext("2d")?.drawImage(img, 0, 0, bitmap.width, bitmap.height);
      resolve(bitmap);
    };
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(wrapSvg(def, svg))}`;
  });

/**
 * Rasterises each animal once. Consecutive static parts are merged into a
 * single bitmap; moving parts (legs, tails) get their own.
 */
const buildSprite = async (def: AnimalDef): Promise<Sprite> => {
  const density = Math.min(4, (def.height * 2.6) / def.vh);
  const groups: { svg: string; pivot?: [number, number]; amp: number; phase: number }[] = [];
  for (const part of def.parts) {
    const last = groups[groups.length - 1];
    if (!part.pivot && last && !last.pivot) {
      last.svg += part.svg;
    } else {
      groups.push({ svg: part.svg, pivot: part.pivot, amp: part.amp ?? 0, phase: part.phase ?? 0 });
    }
  }
  const layers = await Promise.all(
    groups.map(async (g) => ({
      bitmap: await loadSvg(g.svg, def, density),
      pivot: g.pivot,
      amp: g.amp,
      phase: g.phase,
    })),
  );
  return { def, layers };
};

const spriteCache = new Map<AnimalKind, Promise<Sprite>>();
const getSprite = (kind: AnimalKind) => {
  let sprite = spriteCache.get(kind);
  if (!sprite) {
    sprite = buildSprite(AUSTRALIAN_ANIMALS[kind]);
    spriteCache.set(kind, sprite);
  }
  return sprite;
};

const TAU = Math.PI * 2;

const CrowdCanvas = ({
  animals = ALL_ANIMAL_KINDS,
  count = 32,
  speed = 1,
  scale = 1,
  depthRange = 260,
  parallax = 0,
  className,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animalsKey = animals.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stage = { width: 0, height: 0, sizeScale: 1, dpr: 1 };
    let sprites: Sprite[] = [];
    const crowd: Walker[] = [];
    let cancelled = false;
    let visible = true;
    let ticking = false;

    const placeWalker = (w: Walker) => {
      const { def } = w.sprite;
      // Most animals stay near the front; a few wander further back.
      const depth = gsap.parseEase("power2.in")(Math.random());
      const depthScale = 1 - 0.42 * depth;
      const range = Math.min(stage.height * 0.5, depthRange * stage.sizeScale);
      const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const height = def.height * stage.sizeScale * depthScale;
      const unit = height / def.vh;
      const halfWidth = (def.vw / 2 + SVG_PAD) * unit;

      w.dir = dir;
      w.depth = depth;
      w.height = height;
      w.unit = unit;
      w.feetY = stage.height - 8 - depth * range;
      w.startX = dir === 1 ? -halfWidth : stage.width + halfWidth;
      w.endX = dir === 1 ? stage.width + halfWidth : -halfWidth;
      w.velocity = def.speed * stage.sizeScale * depthScale * speed * randomRange(0.8, 1.15);
      w.cycle = def.cycle * randomRange(0.92, 1.12);
      w.duration = Math.abs(w.endX - w.startX) / w.velocity;
      w.elapsed = 0;
    };

    /** Advances position and body motion; returns the gait clock for legs. */
    const step = (w: Walker) => {
      const t = w.elapsed;
      const { def } = w.sprite;
      if (def.gait === "hop") {
        // Airborne for most of the cycle, then a short crouch on the ground.
        const air = w.cycle * 0.7;
        const hops = Math.floor(t / w.cycle);
        const u = t - hops * w.cycle;
        const inAir = Math.min(u, air);
        const f = inAir / air;
        const airSpeed = (w.velocity * w.cycle) / air;
        w.x = w.startX + w.dir * airSpeed * (hops * air + inAir);
        w.lift = u < air ? w.height * def.bounce * 4 * f * (1 - f) : 0;
        w.tilt = u < air ? -0.1 * (1 - 2 * f) : 0;
      } else {
        const phase = (TAU * t) / w.cycle;
        w.x = w.startX + w.dir * w.velocity * t;
        w.lift = w.height * def.bounce * Math.abs(Math.sin(phase));
        w.tilt = def.gait === "waddle" ? 0.035 * Math.sin(phase) : 0;
      }
    };

    const limbAngle = (w: Walker, layer: Layer) => {
      const t = w.elapsed;
      if (w.sprite.def.gait === "hop") {
        const air = w.cycle * 0.7;
        const u = t % w.cycle;
        // legs sweep back→forward in the air, then reset while crouched
        return u < air
          ? layer.amp * Math.cos((Math.PI * u) / air)
          : layer.amp * (-1 + (2 * (u - air)) / (w.cycle - air));
      }
      return layer.amp * Math.sin(TAU * (t / w.cycle + layer.phase));
    };

    const sortCrowd = () => crowd.sort((a, b) => a.feetY - b.feetY);

    const populate = () => {
      crowd.length = 0;
      // Cycle through the chosen animals so each one appears several times.
      const order = [...sprites].sort(() => Math.random() - 0.5);
      for (let i = 0; i < count; i++) {
        const walker = { sprite: order[i % order.length] } as Walker;
        placeWalker(walker);
        walker.elapsed = Math.random() * walker.duration;
        step(walker);
        crowd.push(walker);
      }
      sortCrowd();
    };

    const resize = () => {
      stage.dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      stage.sizeScale = Math.min(1.15, Math.max(0.6, stage.width / 1280)) * scale;
      canvas.width = Math.round(stage.width * stage.dpr);
      canvas.height = Math.round(stage.height * stage.dpr);
      if (sprites.length) {
        populate();
        draw();
      }
    };

    const draw = () => {
      const scrollShift = parallax ? window.scrollY * parallax : 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(stage.dpr, stage.dpr);

      for (const w of crowd) {
        const { def } = w.sprite;
        const groundY = w.feetY + scrollShift * w.depth;

        // soft ground shadow that shrinks while the animal is in the air
        const air = Math.min(0.6, w.lift / (w.height * 0.3));
        const halfW = def.vw * w.unit * 0.36 * (1 - air);
        ctx.fillStyle = `rgba(74, 52, 30, ${0.14 * (1 - air)})`;
        ctx.beginPath();
        ctx.ellipse(w.x, groundY, halfW, w.height * 0.04 + 2, 0, 0, TAU);
        ctx.fill();

        ctx.save();
        ctx.translate(w.x, groundY - w.lift);
        ctx.scale(w.dir, 1);
        ctx.rotate(w.tilt);
        const ox = -(def.vw / 2 + SVG_PAD) * w.unit;
        const oy = -(def.vh + SVG_PAD) * w.unit;
        const bw = (def.vw + SVG_PAD * 2) * w.unit;
        const bh = (def.vh + SVG_PAD * 2) * w.unit;
        for (const layer of w.sprite.layers) {
          if (layer.pivot) {
            const px = (layer.pivot[0] - def.vw / 2) * w.unit;
            const py = (layer.pivot[1] - def.vh) * w.unit;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(limbAngle(w, layer));
            ctx.translate(-px, -py);
            ctx.drawImage(layer.bitmap, ox, oy, bw, bh);
            ctx.restore();
          } else {
            ctx.drawImage(layer.bitmap, ox, oy, bw, bh);
          }
        }
        ctx.restore();
      }
    };

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      const dt = reduceMotion ? 0 : Math.min(deltaTime / 1000, 0.05);
      let resort = false;
      for (const w of crowd) {
        w.elapsed += dt;
        if (w.elapsed >= w.duration) {
          placeWalker(w);
          resort = true;
        }
        step(w);
      }
      if (resort) sortCrowd();
      draw();
    };

    const kinds = animalsKey
      .split(",")
      .filter((k): k is AnimalKind => k in AUSTRALIAN_ANIMALS);

    Promise.all((kinds.length ? kinds : ALL_ANIMAL_KINDS).map(getSprite)).then((loaded) => {
      if (cancelled) return;
      sprites = loaded;
      resize();
      gsap.ticker.add(tick);
      ticking = true;
    });

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    // Pause off-screen canvases so several parades can share a page cheaply.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (ticking) gsap.ticker.remove(tick);
    };
  }, [animalsKey, count, speed, scale, depthRange, parallax]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("absolute bottom-0 h-[90vh] w-full", className)}
    />
  );
};

const Skiper39 = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fbf6ec] text-[#3b2a1a]">
      <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-b from-transparent to-[#f1dcbc]" />
      <div className="absolute left-1/2 top-22 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
        <span className="relative max-w-[14ch] text-xs uppercase leading-tight tracking-wide opacity-50 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-[#3b2a1a] after:content-['']">
          Outback Parade
        </span>
      </div>
      <div className="absolute bottom-0 h-full w-full">
        <CrowdCanvas />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
export default Skiper39;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * Original people illustrations by https://www.openpeeps.com/ — this version
 * swaps them for ink-drawn Australian animals (see australian-animals.ts)
 * with jointed legs and per-animal gaits (hop / walk / waddle / crawl).
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
