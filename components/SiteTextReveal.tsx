"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = [
  ".scholar-section-heading",
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main dt",
  "main dd",
  "main li",
  "main blockquote",
  "main figcaption",
].join(",");

const FORCE_REVEAL_SELECTOR = ".scholar-section-heading";

const SKIP_SELECTOR = [
  "[data-cover-content]",
  "[data-home-layer-entry]",
  "[data-site-layer-entry]",
  ".company-page",
  ".faq-page",
  ".phase-one-hero__copy",
  ".phase-one-capabilities__heading",
  ".phase-one-capabilities__grid",
  ".proposal-workbench",
  ".proposal-console-card",
  ".proposal-evidence-map",
  "[data-no-text-reveal]",
].join(",");

export default function SiteTextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<HTMLElement>();
    let frame = 0;

    const revealImmediately = (element: HTMLElement) => {
      element.dataset.textReveal = "visible";
      observer?.unobserve(element);
    };

    const observer = !reducedMotion.matches && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealImmediately(entry.target as HTMLElement);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" })
      : null;

    const sectionCounts = new Map<Element, number>();
    const registerText = () => {
      const immediate: HTMLElement[] = [];

      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
        if (seen.has(element)) return;

        if (element.closest(SKIP_SELECTOR) && !element.matches(FORCE_REVEAL_SELECTOR)) {
          if (element.dataset.textReveal === "pending") {
            element.dataset.textReveal = "visible";
            element.style.removeProperty("--text-reveal-delay");
          }
          return;
        }

        seen.add(element);
        const section = element.closest("section") ?? element.parentElement ?? document.body;
        const index = sectionCounts.get(section) ?? 0;
        sectionCounts.set(section, index + 1);

        if (!observer) {
          element.dataset.textReveal = "visible";
          return;
        }

        element.dataset.textReveal = "pending";
        element.style.setProperty("--text-reveal-delay", `${Math.min(index, 5) * 45}ms`);
        observer.observe(element);

        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 1.12 && bounds.bottom > -80) {
          immediate.push(element);
        }
      });

      if (immediate.length) {
        window.requestAnimationFrame(() => {
          immediate.forEach((element) => {
            if (element.dataset.textReveal === "pending") revealImmediately(element);
          });
        });
      }
    };

    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        registerText();
      });
    });

    registerText();
    mutations.observe(document.querySelector("main") ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
