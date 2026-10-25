"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { withBase } from "@/lib/base-path";
import manifest from "@/lib/photo-manifest.json";

type Slide = { src: string; alt: string };

/** Centre photos have a 3000px copy under /images/full for the viewer. */
const photos = new Set(manifest.photos);
const fullSize = (src: string) => {
  const m = src.match(/^\/images\/([^/]+)\.jpg$/);
  return m && photos.has(m[1]) ? `/images/full/${m[1]}.jpg` : src;
};

/**
 * Full-screen viewer for any element carrying `data-lightbox="<image path>"`
 * (and optionally `data-lightbox-alt`). Elements inside the same
 * `[data-lightbox-group]` form one gallery; everything else on the page forms
 * the default group. Mounted once per page by <Shell>.
 */
export function Lightbox() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = useCallback((el: HTMLElement) => {
    const group = el.closest<HTMLElement>("[data-lightbox-group]") ?? document.body;
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-lightbox]")).filter(
      (n) => (n.closest("[data-lightbox-group]") ?? document.body) === group,
    );
    setSlides(
      items.map((n) => ({
        src: n.dataset.lightbox!,
        alt: n.dataset.lightboxAlt ?? n.querySelector("img")?.alt ?? "",
      })),
    );
    setIndex(Math.max(0, items.indexOf(el)));
  }, []);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null || !slides.length ? i : (i + d + slides.length) % slides.length)),
    [slides.length],
  );

  // Click / keyboard delegation so server-rendered markup needs no handlers.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
      if (el) {
        e.preventDefault();
        open(el);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-lightbox]");
      if (el && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        open(el);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    // make every trigger focusable for keyboard users
    document.querySelectorAll<HTMLElement>("[data-lightbox]").forEach((n) => {
      if (!n.hasAttribute("tabindex")) n.tabIndex = 0;
      n.setAttribute("role", "button");
      n.setAttribute("aria-label", `View larger: ${n.dataset.lightboxAlt ?? n.querySelector("img")?.alt ?? "photo"}`);
    });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keys while open, and lock page scroll.
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  if (index === null || !slides[index]) return null;
  const slide = slides[index];
  const many = slides.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={slide.alt || "Photo"}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1b1714]/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={close}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-[#1b1714]/20 bg-[#fffdf8] transition hover:-translate-y-0.5 sm:right-6 sm:top-6"
      >
        <X className="size-5" />
      </button>

      <figure className="flex max-h-full max-w-6xl flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.src}
          src={withBase(fullSize(slide.src))}
          onError={(e) => {
            // no large version for this photo — fall back to the page copy
            if (e.currentTarget.src !== withBase(slide.src)) e.currentTarget.src = withBase(slide.src);
          }}
          alt={slide.alt}
          className="max-h-[78vh] max-w-full rounded-2xl border border-[#1b1714]/20 bg-white object-contain animate-[lightbox-in_0.25s_ease-out]"
        />
        <figcaption className="flex items-center gap-3 rounded-full border border-[#1b1714]/20 bg-[#fffdf8] px-4 py-1.5 text-sm font-bold">
          {slide.alt && <span className="max-w-[60vw] truncate">{slide.alt}</span>}
          {many && <span className="opacity-60">{index + 1} / {slides.length}</span>}
        </figcaption>
      </figure>

      {many && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#1b1714]/20 bg-[#fffdf8] transition hover:-translate-y-[calc(50%+2px)] sm:left-6"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#1b1714]/20 bg-[#fffdf8] transition hover:-translate-y-[calc(50%+2px)] sm:right-6"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}
