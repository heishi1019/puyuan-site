"use client";

import { useEffect } from "react";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const getCoverScale = (progress: number) => {
  // Keep the entry deliberately visible: 84% -> 95% -> 100%.
  if (progress <= 0.5) return 0.84 + progress * 0.22;
  return 0.95 + (progress - 0.5) * 0.1;
};

const getElementProgress = (
  element: Element | null,
  viewportHeight: number,
  startRatio: number,
  endRatio: number,
) => {
  if (!element) return 1;

  const start = viewportHeight * startRatio;
  const end = viewportHeight * endRatio;
  let layoutTop = 0;
  let current: Element | null = element;

  while (current instanceof HTMLElement) {
    layoutTop += current.offsetTop;
    current = current.offsetParent;
  }

  const viewportTop = layoutTop - window.scrollY;
  return clamp((start - viewportTop) / (start - end), 0, 1);
};

export default function HomePageCoverMotion() {
  useEffect(() => {
    // The gate stack owns its own sticky choreography. An ancestor transform
    // changes sticky's containing block and makes the final sheet release a
    // frame later than the rest, so keep that section out of cover motion.
    const covers = Array.from(
      document.querySelectorAll<HTMLElement>(".home-color-page--cover:not(.gate-stack-section)"),
    );
    const themedSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-page-theme]"),
    );
    const faqItems = Array.from(
      document.querySelectorAll<HTMLElement>(".phase-two-faq details"),
    );
    const layerEntryGroups = [
      { selector: ".phase-one-capabilities__heading", stagger: 0, horizontal: false },
      { selector: ".phase-one-capabilities__grid article", stagger: 90, horizontal: false },
      { selector: ".phase-two-workflow__frame", stagger: 0, horizontal: true },
      { selector: ".phase-two-products__heading", stagger: 0, horizontal: false },
      { selector: ".phase-two-product", stagger: 100, horizontal: true },
      { selector: ".phase-two-faq__inner > header", stagger: 0, horizontal: false },
      { selector: ".phase-two-contact__inner", stagger: 0, horizontal: true },
    ];
    const layerEntries = layerEntryGroups.flatMap(({ selector, stagger, horizontal }) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)).map((element, index) => ({
        element,
        delay: index * stagger,
        horizontal,
      })),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!covers.length) return;

    let frame = 0;
    let faqObserver: IntersectionObserver | null = null;
    let layerObserver: IntersectionObserver | null = null;

    const clearLayerEntrance = () => {
      layerObserver?.disconnect();
      layerObserver = null;
      delete document.documentElement.dataset.homeLayerEntry;
      layerEntries.forEach(({ element }) => {
        delete element.dataset.homeLayerEntry;
        delete element.dataset.homeLayerVisible;
        element.style.removeProperty("--home-layer-entry-delay");
        element.style.removeProperty("--home-layer-entry-x");
        element.style.removeProperty("--home-layer-entry-y");
      });
    };

    const setUpLayerEntrance = () => {
      if (layerObserver || reducedMotion.matches || !layerEntries.length) return;

      document.documentElement.dataset.homeLayerEntry = "true";
      layerEntries.forEach(({ element, delay, horizontal }) => {
        const cover = element.closest<HTMLElement>(".home-color-page--cover");
        const coverIndex = cover ? covers.indexOf(cover) : 0;
        const direction = coverIndex % 2 === 0 ? 1 : -1;

        element.dataset.homeLayerEntry = "true";
        element.style.setProperty("--home-layer-entry-delay", `${delay}ms`);
        element.style.setProperty(
          "--home-layer-entry-x",
          horizontal ? `${direction * 64}px` : "0px",
        );
        element.style.setProperty("--home-layer-entry-y", horizontal ? "22px" : "38px");
      });

      layerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            element.dataset.homeLayerVisible = "true";
            layerObserver?.unobserve(element);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
      );
      layerEntries.forEach(({ element }) => layerObserver?.observe(element));
    };

    const clearFaqEntrance = () => {
      faqObserver?.disconnect();
      faqObserver = null;
      delete document.documentElement.dataset.homeFaqEntry;
      faqItems.forEach((item) => {
        delete item.dataset.faqVisible;
        item.style.removeProperty("--faq-entry-delay");
      });
    };

    const setUpFaqEntrance = () => {
      if (faqObserver || reducedMotion.matches || !faqItems.length) return;

      document.documentElement.dataset.homeFaqEntry = "true";
      faqItems.forEach((item, index) => {
        item.style.setProperty("--faq-entry-delay", `${index * 80}ms`);
      });

      faqObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const item = entry.target as HTMLElement;
            item.dataset.faqVisible = "true";
            faqObserver?.unobserve(item);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
      );
      faqItems.forEach((item) => faqObserver?.observe(item));
    };

    const setStaticState = () => {
      covers.forEach((cover) => {
        delete cover.dataset.coverMotion;
        cover.removeAttribute("style");
      });
      clearLayerEntrance();
      clearFaqEntrance();
      delete document.documentElement.dataset.homeNavTheme;
    };

    const updateNavigationTheme = () => {
      const probeY = 48;
      const activeSection = themedSections
        .filter((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= probeY && bounds.bottom > probeY;
        })
        .sort((first, second) => {
          const firstLayer = Number.parseInt(window.getComputedStyle(first).zIndex, 10) || 0;
          const secondLayer = Number.parseInt(window.getComputedStyle(second).zIndex, 10) || 0;
          return secondLayer - firstLayer;
        })[0];

      document.documentElement.dataset.homeNavTheme = activeSection?.dataset.pageTheme ?? "light";
    };

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        setStaticState();
        updateNavigationTheme();
        return;
      }

      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth <= 520;
      const overlap = window.innerWidth <= 820 ? 48 : 72;

      covers.forEach((cover) => {
        const progress = getElementProgress(cover, viewportHeight, 1.02, .42);

        cover.dataset.coverMotion = "true";
        cover.style.setProperty("--page-cover-progress", progress.toFixed(4));
        cover.style.setProperty("--page-cover-opacity", (.78 + progress * .22).toFixed(4));
        cover.style.setProperty("--page-cover-radius", `${(isMobile ? 46 - progress * 18 : 62 - progress * 26).toFixed(2)}px`);
        cover.style.setProperty("--page-cover-y", `${((1 - progress) * overlap * 2.18).toFixed(2)}px`);
        cover.style.setProperty("--page-cover-scale", getCoverScale(progress).toFixed(4));
        cover.style.setProperty("--page-cover-shadow-y", `${(-8 - progress * 26).toFixed(2)}px`);
        cover.style.setProperty("--page-cover-shadow-blur", `${(24 + progress * 54).toFixed(2)}px`);
        cover.style.setProperty("--page-cover-shadow-alpha", (.04 + progress * .16).toFixed(4));
        // Release the transform containing block once the page has landed so
        // sticky content inside later cover pages can attach to the viewport.
        if (progress >= 0.999) delete cover.dataset.coverMotion;
      });

      updateNavigationTheme();
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    setUpLayerEntrance();
    setUpFaqEntrance();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      setStaticState();
    };
  }, []);

  return null;
}
