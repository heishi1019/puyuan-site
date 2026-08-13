"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const COVER_DURATION = 520;
const REVEAL_DURATION = 780;

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const transitionPending = useRef(false);
  const coverTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!transitionPending.current) return;

    const root = document.documentElement;
    const main = document.querySelector<HTMLElement>("main");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.dataset.routeTransition = "revealing";
        main?.setAttribute("data-route-enter", "true");

        revealTimer.current = window.setTimeout(() => {
          delete root.dataset.routeTransition;
          main?.removeAttribute("data-route-enter");
          transitionPending.current = false;
        }, REVEAL_DURATION);
      });
    });
  }, [pathname]);

  useEffect(() => {
    const handleNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.target === "_blank") return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.protocol !== "http:" && destination.protocol !== "https:") return;

      const current = new URL(window.location.href);
      const sameDocument =
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (sameDocument || transitionPending.current) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      event.preventDefault();
      transitionPending.current = true;

      const root = document.documentElement;
      root.style.setProperty("--route-origin-x", `${event.clientX}px`);
      root.style.setProperty("--route-origin-y", `${event.clientY}px`);
      root.dataset.routeTransition = "covering";

      coverTimer.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, COVER_DURATION);
    };

    // Listen during capture so Next Link cannot complete its client-side
    // navigation before the transition has claimed same-origin links.
    document.addEventListener("click", handleNavigation, true);
    return () => {
      document.removeEventListener("click", handleNavigation, true);
      if (coverTimer.current) window.clearTimeout(coverTimer.current);
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
      delete document.documentElement.dataset.routeTransition;
    };
  }, [router]);

  return (
    <div className="route-transition" aria-hidden="true">
      <div className="route-transition__veil" />
      <span className="route-transition__source" />
    </div>
  );
}
