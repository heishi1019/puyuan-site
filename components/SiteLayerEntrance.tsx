"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type EntryGroup = {
  selector: string;
  stagger?: number;
  delayModulo?: number;
  horizontal?: boolean;
};

const ROUTE_ENTRIES: Record<string, EntryGroup[]> = {
  "/proposalpilot": [
    { selector: ".proposal-page > section [data-cover-content]", horizontal: false },
    { selector: ".proposal-faq .faq-accordion details", stagger: 85, delayModulo: 6, horizontal: true },
    { selector: ".proposal-early-access__icon, .proposal-early-access h2, .proposal-early-access p, .proposal-early-access__action, .proposal-early-access a:last-child", stagger: 90, horizontal: false },
  ],
  "/scholarpilot": [
    { selector: ".scholar-faq .scholar-section-heading", horizontal: false },
    { selector: ".scholar-faq .faq-accordion details", stagger: 85, delayModulo: 6, horizontal: true },
  ],
  "/about": [
    { selector: ".company-hero__layout > div", stagger: 110, horizontal: true },
    { selector: ".company-hero__facts", horizontal: false },
    { selector: ".company-identity__layout", horizontal: false },
    { selector: ".company-problems__heading, .company-focus__heading", horizontal: false },
    { selector: ".company-problems__grid article, .company-focus__grid article", stagger: 90 },
    { selector: ".company-origin .company-split", horizontal: true },
    { selector: ".company-method .company-section__heading, .company-products .company-section__heading", horizontal: false },
    { selector: ".company-method__track article", stagger: 70 },
    { selector: ".company-product-row", stagger: 100, horizontal: true },
    { selector: ".company-principles__intro", horizontal: false },
    { selector: ".company-principles__layout > ol > li", stagger: 70 },
    { selector: ".company-future__layout", horizontal: false },
  ],
  "/faq": [
    { selector: ".faq-hero .company-shell", horizontal: false },
    { selector: ".faq-index", horizontal: true },
    { selector: ".faq-group__heading", horizontal: false },
    { selector: ".faq-list details", stagger: 75, delayModulo: 5, horizontal: true },
    { selector: ".faq-closing", horizontal: false },
  ],
};

export default function SiteLayerEntrance() {
  const pathname = usePathname();

  useEffect(() => {
    const groups = ROUTE_ENTRIES[pathname];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!groups?.length || reducedMotion.matches) return;

    const entries = new Map<HTMLElement, { delay: number; horizontal: boolean }>();
    groups.forEach(({ selector, stagger = 0, delayModulo, horizontal = false }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        if (entries.has(element)) return;
        const delayIndex = delayModulo ? index % delayModulo : index;
        entries.set(element, { delay: delayIndex * stagger, horizontal });
      });
    });

    if (!entries.size) return;

    const root = document.documentElement;
    root.dataset.siteLayerEntry = "true";

    entries.forEach(({ delay, horizontal }, element) => {
      const direction = element.getBoundingClientRect().left < window.innerWidth / 2 ? -1 : 1;
      element.dataset.siteLayerEntry = "true";
      element.style.setProperty("--site-layer-entry-delay", `${delay}ms`);
      element.style.setProperty("--site-layer-entry-x", horizontal ? `${direction * 56}px` : "0px");
      element.style.setProperty("--site-layer-entry-y", horizontal ? "18px" : "34px");
    });

    const observer = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.siteLayerVisible = "true";
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    entries.forEach((_, element) => observer.observe(element));

    return () => {
      observer.disconnect();
      delete root.dataset.siteLayerEntry;
      entries.forEach((_, element) => {
        delete element.dataset.siteLayerEntry;
        delete element.dataset.siteLayerVisible;
        element.style.removeProperty("--site-layer-entry-delay");
        element.style.removeProperty("--site-layer-entry-x");
        element.style.removeProperty("--site-layer-entry-y");
      });
    };
  }, [pathname]);

  return null;
}
