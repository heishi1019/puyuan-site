"use client";

import { useEffect } from "react";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export default function ScholarPageCoverMotion() {
  useEffect(() => {
    const covers = Array.from(document.querySelectorAll<HTMLElement>(".scholar-cover"));
    const themes = Array.from(document.querySelectorAll<HTMLElement>("[data-scholar-theme]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;

      covers.forEach((cover) => {
        if (reducedMotion.matches) {
          delete cover.dataset.coverMotion;
          cover.removeAttribute("style");
          return;
        }

        const progress = clamp(
          (viewportHeight * 1.04 - cover.getBoundingClientRect().top) / (viewportHeight * .58),
          0,
          1,
        );
        const radius = window.innerWidth <= 640 ? 30 - progress * 12 : 54 - progress * 24;
        const travel = window.innerWidth <= 640 ? 58 : 88;

        cover.dataset.coverMotion = "true";
        cover.style.setProperty("--scholar-cover-y", `${((1 - progress) * travel).toFixed(2)}px`);
        cover.style.setProperty("--scholar-cover-scale", (0.94 + progress * .06).toFixed(4));
        cover.style.setProperty("--scholar-cover-radius", `${radius.toFixed(2)}px`);
        cover.style.setProperty("--scholar-cover-opacity", (.74 + progress * .26).toFixed(4));

        if (progress >= .999) delete cover.dataset.coverMotion;
      });

      const activeTheme = themes.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= 52 && bounds.bottom > 52;
      });
      document.documentElement.dataset.scholarNavTheme = activeTheme?.dataset.scholarTheme ?? "light";
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      delete document.documentElement.dataset.scholarNavTheme;
    };
  }, []);

  return null;
}
