"use client";

import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface MurmurationWordmarkProps {
  /** The word the flock spells out. */
  text?: string;
  /** Upper limit on birds; the word's size decides the actual count. */
  maxBirds?: number;
  /** Bird ink colour. */
  color?: string;
  /** CSS font-family for the word. Defaults to the site's display font. */
  fontFamily?: string;
  className?: string;
}

type Bird = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** home position inside the free-flying flock shape */
  ox: number;
  oy: number;
  /** letter position */
  tx: number;
  ty: number;
  delay: number;
  angle: number;
  flap: number;
  size: number;
};

type Phase = "flock" | "form" | "hold" | "scatter";

const PHASES: Record<Phase, { duration: number; next: Phase }> = {
  flock: { duration: 3.2, next: "form" },
  form: { duration: 3.6, next: "hold" },
  hold: { duration: 6, next: "scatter" },
  scatter: { duration: 0.9, next: "flock" },
};

const HAWK_RADIUS = 90;

/**
 * A starling murmuration that converges, bird by bird, into a word, holds it,
 * then scatters back into the sky. The pointer is a hawk the flock tears open
 * around.
 */
export default function MurmurationWordmark({
  text = "Womindjeka",
  maxBirds = 2200,
  color = "#1b1714",
  fontFamily,
  className,
}: MurmurationWordmarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = { width: 0, height: 0, dpr: 1 };
    const hawk = { x: -9999, y: -9999, active: false };
    let birds: Bird[] = [];
    let phase: Phase = "flock";
    // start just before forming so the word appears soon after load
    let phaseTime = PHASES.flock.duration - 0.8;
    let clock = 0;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let cancelled = false;

    const family = () =>
      fontFamily ??
      (getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
        "Georgia, serif");

    /** Rasterises the word off-screen and returns points inside the glyphs. */
    const sampleText = () => {
      const { width, height } = stage;
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(width));
      off.height = Math.max(1, Math.floor(height));
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return null;

      let size = height * 0.42;
      octx.font = `800 ${size}px ${family()}`;
      const measured = octx.measureText(text).width;
      size = Math.min(size, (size * width * 0.88) / measured);
      octx.font = `800 ${size}px ${family()}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#000";
      octx.fillText(text, width / 2, height / 2);

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.round(size / 42));
      const points: [number, number][] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 140) {
            points.push([x + (Math.random() - 0.5) * step * 0.6, y + (Math.random() - 0.5) * step * 0.6]);
          }
        }
      }
      // shuffle, then trim to the bird budget
      for (let i = points.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [points[i], points[j]] = [points[j], points[i]];
      }
      return { points: points.slice(0, maxBirds), size, step };
    };

    const build = () => {
      const sampled = sampleText();
      if (sampled?.points.length) {
        const { points, step } = sampled;
        // keep existing birds where possible so a resize doesn't reset the sky
        const next: Bird[] = points.map(([tx, ty], i) => {
          const prev = birds[i];
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random());
          return {
            x: prev?.x ?? Math.random() * stage.width,
            y: prev?.y ?? Math.random() * stage.height * 0.6,
            vx: prev?.vx ?? 0,
            vy: prev?.vy ?? 0,
            ox: Math.cos(a) * r,
            oy: Math.sin(a) * r,
            tx,
            ty,
            // left-to-right-ish arrival so the word writes itself
            delay: (tx / stage.width) * 1.4 + Math.random() * 0.9,
            angle: prev?.angle ?? 0,
            flap: Math.random() * Math.PI * 2,
            size: Math.max(1.6, step * (0.55 + Math.random() * 0.3)),
          };
        });
        birds = next;
      }
      if (reduceMotion) {
        for (const b of birds) {
          b.x = b.tx;
          b.y = b.ty;
        }
        phase = "hold";
      }
    };

    const resize = () => {
      stage.dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = Math.round(stage.width * stage.dpr);
      canvas.height = Math.round(stage.height * stage.dpr);
      build();
      draw();
    };

    const update = (dt: number) => {
      phaseTime += dt;
      clock += dt;
      if (phaseTime > PHASES[phase].duration) {
        phaseTime = 0;
        phase = PHASES[phase].next;
        if (phase === "scatter") {
          const cx = stage.width / 2;
          const cy = stage.height / 2;
          for (const b of birds) {
            const dx = b.x - cx + (Math.random() - 0.5) * 40;
            const dy = b.y - cy + (Math.random() - 0.5) * 40;
            const d = Math.hypot(dx, dy) || 1;
            const burst = 260 + Math.random() * 320;
            b.vx += (dx / d) * burst;
            b.vy += (dy / d) * burst - 120;
          }
        }
      }

      // The free flock: a blob that drifts, turns and stretches across the sky.
      const { width: W, height: H } = stage;
      const ax = W / 2 + W * 0.3 * Math.sin(clock * 0.27);
      const ay = H * 0.42 + H * 0.16 * Math.sin(clock * 0.47 + 1);
      const rot = clock * 0.35;
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const sx = W * 0.17 * (1 + 0.45 * Math.sin(clock * 0.61));
      const sy = H * 0.14 * (1 + 0.35 * Math.cos(clock * 0.83));

      for (const b of birds) {
        const forming =
          (phase === "form" && phaseTime > b.delay) || phase === "hold";
        let gx: number;
        let gy: number;
        let k: number;
        if (forming) {
          gx = b.tx;
          gy = b.ty;
          k = phase === "hold" ? 30 : 9;
        } else {
          const lx = b.ox * sx;
          const ly = b.oy * sy;
          // ripple through the flock so it doesn't move as one rigid shape
          const wave = Math.sin(clock * 2.1 + b.ox * 4) * 14;
          gx = ax + lx * cr - ly * sr;
          gy = ay + lx * sr + ly * cr + wave;
          k = phase === "scatter" ? 0.6 : 2.2;
        }
        const damping = 2 * Math.sqrt(k) * 0.85;
        let fx = (gx - b.x) * k - b.vx * damping;
        let fy = (gy - b.y) * k - b.vy * damping;

        if (hawk.active) {
          const dx = b.x - hawk.x;
          const dy = b.y - hawk.y;
          const d = Math.hypot(dx, dy);
          if (d < HAWK_RADIUS && d > 0.01) {
            const push = (1 - d / HAWK_RADIUS) * 5200;
            fx += (dx / d) * push;
            fy += (dy / d) * push;
          }
        }

        b.vx += fx * dt;
        b.vy += fy * dt;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 700) {
          b.vx = (b.vx / speed) * 700;
          b.vy = (b.vy / speed) * 700;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (speed > 18) {
          const target = Math.atan2(b.vy, b.vx);
          let diff = target - b.angle;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          b.angle += diff * Math.min(1, dt * 10);
        }
        b.flap += dt * (6 + Math.min(speed, 400) / 30);
      }
    };

    const draw = () => {
      ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
      ctx.clearRect(0, 0, stage.width, stage.height);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(1.1, (birds[0]?.size ?? 2) * 0.42);
      ctx.beginPath();
      for (const b of birds) {
        // a tiny "v": two wings swept back from the head, flapping
        const s = b.size;
        const wing = Math.sin(b.flap) * 0.6;
        const c = Math.cos(b.angle);
        const sn = Math.sin(b.angle);
        const bx = -s;
        const by = s * (0.8 + wing * 0.5);
        ctx.moveTo(b.x + bx * c - by * sn, b.y + bx * sn + by * c);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(b.x + bx * c + by * sn, b.y + bx * sn - by * c);
      }
      ctx.stroke();
    };

    const loop = (now: number) => {
      if (cancelled) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (visible && !reduceMotion) {
        update(dt);
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hawk.x = e.clientX - r.left;
      hawk.y = e.clientY - r.top;
      hawk.active = true;
    };
    const onLeave = () => {
      hawk.active = false;
    };
    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const resizeObserver = new ResizeObserver(() => resize());
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    // Wait for the web font so the word is sampled in the right typeface.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      resize();
      resizeObserver.observe(canvas);
      visibilityObserver.observe(canvas);
      last = performance.now();
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [text, maxBirds, color, fontFamily]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={text}
      className={cn("block h-[60vh] min-h-[360px] w-full", className)}
    />
  );
}

export { MurmurationWordmark };
