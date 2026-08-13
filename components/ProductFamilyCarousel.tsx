"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Card from "@/components/Card";

const products = [
  { id: "proposal", name: "智小申", nameEn: "ProposalPilot Agent", desc: "从发现机会到申报提醒，系统协作完成项目申报，关键节点由企业做决定。", capabilities: ["政策匹配与资格诊断", "跨 200 页材料的证据核查", "私有化部署或加密云端"], href: "/proposalpilot", badge: "主推", visual: "proposal" },
  { id: "scholar", name: "科小文", nameEn: "ScholarPilot Agent", desc: "面向科研人员的写作协作 agent，从选题、文献综述到初稿与润色逐步展开。", capabilities: ["选题与文献综述", "初稿生成", "润色与投稿准备"], href: "/scholarpilot", badge: "即将上线", visual: "scholar" },
] as const;
const itemById = Object.fromEntries(products.map((product) => [product.id, product])) as Record<string, (typeof products)[number]>;
const carouselItems = ["proposal", "scholar", "test-1", "test-2", "test-3"] as const;
const basePosition = { proposal: 0, scholar: 1, "test-1": 2, "test-2": 3, "test-3": 4 } as const;
const maxPhase = carouselItems.length - 1;

function getPose(id: (typeof carouselItems)[number], phase: number) {
  const trackPosition = basePosition[id] - phase;
  const distance = Math.abs(trackPosition);
  const arcFactor = Math.min(1, distance);
  const x = trackPosition * 350;
  const opacity = distance <= 1 ? 1 - distance * .16 : Math.max(0, .84 * (1 - (distance - 1) / .55));
  return {
    x,
    y: arcFactor * arcFactor * 54,
    rotate: Math.max(-16, Math.min(16, x * .035)),
    scale: 1 - arcFactor * .12,
    z: Math.round((1 - arcFactor) * 10) + 1,
    opacity,
    visible: distance < 1.55,
  };
}

function getCenteredItem(phase: number) {
  return carouselItems[Math.max(0, Math.min(maxPhase, Math.round(phase)))];
}

function getTransform(pose: ReturnType<typeof getPose>) {
  return `translate3d(calc(-50% + ${pose.x}px), ${pose.y}px, 0) rotate(${pose.rotate}deg) scale(${pose.scale})`;
}

export default function ProductFamilyCarousel() {
  const [activeId, setActiveId] = useState<string>("proposal");
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef(new Map<string, HTMLElement>());
  const slideAnimations = useRef(new Map<string, Animation>());
  const phase = useRef(0);
  const dragOriginPhase = useRef(0);
  const dragStart = useRef<number | null>(null);
  const dragMotion = useRef({ lastX: 0, lastTime: 0, velocity: 0 });
  const isDragging = useRef(false);
  const dragPointerId = useRef<number | null>(null);
  const didDrag = useRef(false);
  const isSettling = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPhase = (nextPhase: number) => {
    const constrainedPhase = Math.max(0, Math.min(maxPhase, nextPhase));
    phase.current = constrainedPhase;
    carouselItems.forEach((id) => {
      const element = slideRefs.current.get(id);
      if (!element) return;
      const pose = getPose(id, constrainedPhase);
      element.style.transform = getTransform(pose);
      element.style.zIndex = `${pose.z}`;
      element.style.opacity = `${pose.opacity}`;
      element.style.visibility = pose.visible ? "visible" : "hidden";
    });
  };

  const animateTo = (targetPhase: number) => {
    slideAnimations.current.forEach((animation) => animation.cancel());
    slideAnimations.current.clear();
    if (settleTimer.current !== null) clearTimeout(settleTimer.current);
    const constrainedTarget = Math.max(0, Math.min(maxPhase, targetPhase));
    const startPhase = phase.current;
    const distance = constrainedTarget - startPhase;
    const travel = Math.abs(distance);
    const duration = Math.min(1280, 760 + Math.max(0, travel - 1) * 160);
    const frameCount = Math.min(40, 16 + Math.ceil(Math.max(0, travel - 1)) * 6);
    const minPhase = Math.min(startPhase, constrainedTarget);
    const maxPhaseInTravel = Math.max(startPhase, constrainedTarget);
    const nextActiveId = getCenteredItem(constrainedTarget);
    if (Math.abs(distance) < .001) {
      setActiveId(nextActiveId);
      isSettling.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyPhase(constrainedTarget);
      setActiveId(nextActiveId);
      isSettling.current = false;
      return;
    }
    isSettling.current = true;
    sectionRef.current?.classList.add("is-settling");
    carouselItems.forEach((id) => {
      const element = slideRefs.current.get(id);
      if (!element) return;
      const startPose = getPose(id, startPhase);
      const targetPose = getPose(id, constrainedTarget);
      const closestPhase = Math.max(minPhase, Math.min(maxPhaseInTravel, basePosition[id]));
      const becomesVisible = Math.abs(basePosition[id] - closestPhase) < 1.55;
      if (!becomesVisible) {
        element.style.transform = getTransform(targetPose);
        element.style.opacity = "0";
        element.style.visibility = "hidden";
        element.style.zIndex = `${targetPose.z}`;
        return;
      }
      element.style.visibility = "visible";
      const frames = Array.from({ length: frameCount }, (_, index) => {
        const progress = index / (frameCount - 1);
        const eased = progress < .5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const pose = getPose(id, startPhase + distance * eased);
        return { transform: getTransform(pose), opacity: pose.opacity, zIndex: pose.z, offset: progress };
      });
      const animation = element.animate(frames, { duration, easing: "linear", fill: "forwards" });
      slideAnimations.current.set(id, animation);
    });
    settleTimer.current = setTimeout(() => {
      phase.current = constrainedTarget;
      applyPhase(constrainedTarget);
      slideAnimations.current.forEach((animation) => animation.cancel());
      slideAnimations.current.clear();
      setActiveId(nextActiveId);
      sectionRef.current?.classList.remove("is-settling");
      isSettling.current = false;
      settleTimer.current = null;
    }, duration + 10);
  };

  const rotate = (direction: -1 | 1) => {
    if (isSettling.current) return;
    animateTo(Math.round(phase.current) + direction);
  };

  const select = (id: string) => {
    if (isSettling.current) return;
    animateTo(id === "proposal" ? 0 : 1);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (isSettling.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    dragStart.current = event.clientX;
    dragOriginPhase.current = phase.current;
    dragMotion.current = { lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
    isDragging.current = true;
    sectionRef.current?.classList.add("is-dragging");
    dragPointerId.current = event.pointerId;
    didDrag.current = false;
  };
  useEffect(() => {
    const onWindowPointerMove = (event: PointerEvent) => {
      if (!isDragging.current || dragStart.current === null || event.pointerId !== dragPointerId.current) return;
      event.preventDefault();
      const now = performance.now();
      const delta = event.clientX - dragStart.current;
      const frameDelta = event.clientX - dragMotion.current.lastX;
      const elapsed = Math.max(8, now - dragMotion.current.lastTime);
      dragMotion.current.velocity = dragMotion.current.velocity * .72 + (frameDelta / elapsed) * 16 * .28;
      dragMotion.current.lastX = event.clientX;
      dragMotion.current.lastTime = now;
      if (Math.abs(delta) > 4) didDrag.current = true;
      applyPhase(dragOriginPhase.current - delta / 350);
    };
    const onWindowPointerUp = (event: PointerEvent) => {
      if (!isDragging.current || dragStart.current === null || event.pointerId !== dragPointerId.current) return;
      isDragging.current = false;
      sectionRef.current?.classList.remove("is-dragging");
      dragStart.current = null;
      dragPointerId.current = null;
      if (!didDrag.current) {
        animateTo(Math.round(dragOriginPhase.current));
        return;
      }
      const projectedPhase = phase.current - dragMotion.current.velocity / 70;
      animateTo(Math.round(projectedPhase));
    };
    window.addEventListener("pointermove", onWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      slideAnimations.current.forEach((animation) => animation.cancel());
      slideAnimations.current.clear();
      if (settleTimer.current !== null) clearTimeout(settleTimer.current);
      sectionRef.current?.classList.remove("is-dragging", "is-settling");
      isSettling.current = false;
      isDragging.current = false;
    };
  }, []);

  return <section ref={sectionRef} id="products" className="home-products mx-auto max-w-6xl px-6 py-section" data-active={activeId}>
    <div className="home-products__heading"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Product family</p><h2 className="site-section-title mt-3 text-3xl font-semibold text-text">从一个源点，进入不同工作流</h2></div><div className="home-products__controls"><p className="max-w-sm text-sm leading-relaxed text-muted">先从明确的专业任务开始，再把可靠的方法扩展到更多场景。</p><div className="home-products__arrows"><button type="button" aria-label="上一个产品" onClick={() => rotate(-1)}><ArrowLeft size={16} weight="bold" aria-hidden="true" /></button><button type="button" aria-label="下一个产品" onClick={() => rotate(1)}><ArrowRight size={16} weight="bold" aria-hidden="true" /></button></div></div></div>
    <div className="home-products__tabs" role="tablist" aria-label="选择产品">{products.map((product) => <button key={product.id} type="button" role="tab" aria-selected={activeId === product.id} className={activeId === product.id ? "is-active" : ""} onClick={() => select(product.id)}>{product.name}<span>{product.nameEn}</span></button>)}</div>
    <div className="home-products__viewport">
      <div className="home-products__fan-stage" aria-live="polite">
        {carouselItems.map((id) => {
          const product = id === "proposal" || id === "scholar" ? itemById[id] : null;
          const pose = getPose(id, phase.current);
          const label = product?.name ?? `空白测试页 ${id.slice(-1)}`;
          return <article key={id} ref={(element) => { if (element) slideRefs.current.set(id, element); else slideRefs.current.delete(id); }} className={`home-products__slide${id === activeId ? " is-active" : ""}${product ? "" : " is-test"}`} role="tabpanel" aria-label={label} style={{ transform: getTransform(pose), zIndex: pose.z, opacity: pose.opacity, visibility: pose.visible ? "visible" : "hidden" } as CSSProperties} onPointerDown={onPointerDown}>
            {product ? <Card spotlight><div className={`home-product-card home-product-card--${product.visual}`}><div className="home-product-card__visual" aria-hidden="true">{product.visual === "proposal" ? <><span className="home-product-card__visual-label">SOURCE / EVIDENCE</span><div className="home-product-card__orbit home-product-card__orbit--one" /><div className="home-product-card__orbit home-product-card__orbit--two" /><div className="home-product-card__core">源</div><i className="home-product-card__node home-product-card__node--one" /><i className="home-product-card__node home-product-card__node--two" /><i className="home-product-card__node home-product-card__node--three" /></> : <><span className="home-product-card__visual-label">DRAFT / REVIEW / READY</span><div className="home-product-card__paper home-product-card__paper--back" /><div className="home-product-card__paper home-product-card__paper--mid" /><div className="home-product-card__paper home-product-card__paper--front"><b>∑</b><span /><span /><span /></div></>}</div><div className="flex h-full flex-col justify-between gap-10"><div><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs tracking-wide text-accent">{product.nameEn}</p><h3 className="mt-3 text-3xl font-semibold text-text">{product.name}</h3></div><span className="rounded-pill border border-accent/30 px-3 py-1 font-mono text-[11px] text-accent">{product.badge}</span></div><p className="mt-5 max-w-xl leading-relaxed text-muted">{product.desc}</p><ul className="mt-7 space-y-3">{product.capabilities.map((capability) => <li key={capability} className="flex gap-3 text-sm text-text"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{capability}</li>)}</ul></div><Link href={product.href} className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={(event) => { if (didDrag.current) event.preventDefault(); }}>了解详情 <span aria-hidden="true">→</span></Link></div></div></Card> : <Card className="home-products__test-shell"><div className="home-products__test-card"><span>TEST PAGE</span><strong>{id.slice(-1).padStart(2, "0")}</strong></div></Card>}
          </article>;
        })}
      </div>
    </div>
  </section>;
}
