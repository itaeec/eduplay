"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

/**
 * Wires up scroll-driven motion declared with data attributes:
 *
 * - `data-parallax-scope` + children with `data-speed` — layered parallax
 *   (speed < 1 lags behind the page, > 1 moves ahead of it)
 * - `data-hero-copy` — fades and lifts as the hero scrolls away
 * - `data-float="<px>"` — drifts by ±px across its parent's trip through
 *   the viewport; add `data-rotate="<deg>"` for a slow tilt as well
 * - `data-intro` — children stagger in on first load
 * - `data-reveal` — fades up when scrolled into view (stagger siblings)
 * - `data-parallax-img` — image drifts inside its frame
 * - `data-pin-bg` — background layer that moves slower than its section
 */
export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax-scope]").forEach((scope) => {
        scope.querySelectorAll<HTMLElement | SVGElement>("[data-speed]").forEach((el) => {
          const speed = parseFloat(el.dataset.speed ?? "1");
          gsap.to(el, {
            y: () => (1 - speed) * scope.offsetHeight * 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });

        const copy = scope.querySelector("[data-hero-copy]");
        if (copy) {
          gsap.to(copy, {
            y: -90,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top top", end: "65% top", scrub: true },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
        const distance = parseFloat(el.dataset.float ?? "60");
        const rotate = parseFloat(el.dataset.rotate ?? "0");
        gsap.fromTo(
          el,
          { y: distance, rotation: -rotate },
          {
            y: -distance,
            rotation: rotate,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-pin-bg]").forEach((bg) => {
        const section = bg.closest("section") ?? bg.parentElement!;
        gsap.fromTo(
          bg,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-intro]").forEach((group) => {
        gsap.from(group.children, {
          y: 28,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.15,
        });
      });

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { y: 40, opacity: 0 });
      ScrollTrigger.batch(reveals, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    // Late-loading images change layout heights; recalculate once they settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
