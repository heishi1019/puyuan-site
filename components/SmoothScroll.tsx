"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");

    if (!media.matches) return;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
    });

    const updateScroll = () => ScrollTrigger.update();
    const updateFrame = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScroll);
    gsap.ticker.add(updateFrame);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("has-lenis");
    ScrollTrigger.refresh();

    return () => {
      document.documentElement.classList.remove("has-lenis");
      lenis.off("scroll", updateScroll);
      lenis.destroy();
      gsap.ticker.remove(updateFrame);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return null;
}
