"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeManifestoMotion() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const section = document.querySelector<HTMLElement>("#about.home-manifesto");
      if (!section) return;

      const label = section.querySelector<HTMLElement>(".company-section__label");
      const signals = section.querySelector<HTMLElement>(".home-manifesto__signals");
      const copy = section.querySelector<HTMLElement>(".company-identity__copy");
      const visual = section.querySelector<HTMLElement>(".company-source-visual");
      const facts = section.querySelector<HTMLElement>(".company-identity__facts");
      const content = [label, signals, copy, visual, facts].filter((item): item is HTMLElement => Boolean(item));

      document.documentElement.classList.add("has-gsap-manifesto");
      gsap.set(content, { opacity: 0, y: 34 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 98%",
          end: "top 16%",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        section,
        {
          y: 156,
          scale: 0.84,
          opacity: 0.78,
          borderTopLeftRadius: 76,
          borderTopRightRadius: 76,
          boxShadow: "0 -10px 28px rgba(7,23,45,.08)",
          transformOrigin: "50% 0%",
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          borderTopLeftRadius: 56,
          borderTopRightRadius: 56,
          boxShadow: "0 -22px 58px rgba(7,23,45,.12)",
          duration: 1,
          ease: "none",
        },
        0,
      );

      if (label) timeline.to(label, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0.08);
      if (signals) timeline.to(signals, { opacity: 1, y: 0, duration: 0.24, ease: "none" }, 0.16);
      if (copy) timeline.to(copy, { opacity: 1, y: 0, duration: 0.28, ease: "none" }, 0.3);
      if (visual) timeline.to(visual, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 0.4);
      if (facts) timeline.to(facts, { opacity: 1, y: 0, duration: 0.24, ease: "none" }, 0.64);

      ScrollTrigger.refresh();

      return () => {
        document.documentElement.classList.remove("has-gsap-manifesto");
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
