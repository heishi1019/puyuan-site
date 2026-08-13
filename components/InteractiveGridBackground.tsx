"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 42;
const POINTER_RADIUS = 210;
const FLOW_DURATION = 1500;

type Point = { x: number; y: number };

export default function InteractiveGridBackground({ tone = "blue" }: { tone?: "blue" | "mono" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return;

    const pointer: Point & { active: boolean } = { x: 0, y: 0, active: false };
    let flow: (Point & { startedAt: number }) | null = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const localPoint = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();
      return { x: clientX - bounds.left, y: clientY - bounds.top };
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      Object.assign(pointer, localPoint(event.clientX, event.clientY), { active: true });
    };
    const handlePointerLeave = () => { pointer.active = false; };
    const handleClick = (event: globalThis.MouseEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      const point = localPoint(event.clientX, event.clientY);
      flow = {
        x: Math.round(point.x / GRID_SIZE) * GRID_SIZE + 0.5,
        y: Math.round(point.y / GRID_SIZE) * GRID_SIZE + 0.5,
        startedAt: performance.now(),
      };
    };

    const intensityAt = (x: number, y: number, now: number) => {
      let intensity = 0;
      if (pointer.active) {
        const distance = Math.hypot(x - pointer.x, y - pointer.y);
        intensity = Math.max(0, 1 - distance / POINTER_RADIUS) ** 2;
      }
      if (flow && !reduceMotion.matches) {
        const elapsed = now - flow.startedAt;
        if (elapsed >= FLOW_DURATION) {
          flow = null;
        } else {
          const progress = elapsed / FLOW_DURATION;
          const phase = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
          const distance = Math.abs(x - flow.x) + Math.abs(y - flow.y);
          const waveDistance = (1 - Math.pow(1 - phase, 3)) * (width + height) * 0.62;
          const wave = Math.max(0, 1 - Math.abs(distance - waveDistance) / 92);
          intensity = Math.max(intensity, wave * wave);
        }
      }
      return intensity;
    };

    const drawSegment = (x1: number, y1: number, x2: number, y2: number, intensity: number) => {
      context.strokeStyle = tone === "mono"
        ? `rgba(215, 255, 0, ${0.14 + intensity * 0.76})`
        : `rgba(29, 91, 255, ${0.18 + intensity * 0.72})`;
      context.lineWidth = 1 + intensity * 1.3;
      context.shadowColor = tone === "mono"
        ? `rgba(215, 255, 0, ${intensity * 0.72})`
        : `rgba(67, 162, 255, ${intensity * 0.8})`;
      context.shadowBlur = 4 + intensity * 12;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = tone === "mono" ? "rgba(255, 255, 255, 0.11)" : "rgba(77, 120, 192, 0.14)";
      context.lineWidth = 1;
      context.shadowBlur = 0;
      context.beginPath();
      for (let x = 0.5; x <= width; x += GRID_SIZE) { context.moveTo(x, 0); context.lineTo(x, height); }
      for (let y = 0.5; y <= height; y += GRID_SIZE) { context.moveTo(0, y); context.lineTo(width, y); }
      context.stroke();

      context.lineCap = "round";
      for (let y = 0.5; y <= height; y += GRID_SIZE) {
        for (let x = 0.5; x <= width; x += GRID_SIZE) {
          if (x + GRID_SIZE <= width + 1) {
            const intensity = intensityAt(x + GRID_SIZE / 2, y, now);
            if (intensity > 0.015) drawSegment(x, y, x + GRID_SIZE, y, intensity);
          }
          if (y + GRID_SIZE <= height + 1) {
            const intensity = intensityAt(x, y + GRID_SIZE / 2, now);
            if (intensity > 0.015) drawSegment(x, y, x, y + GRID_SIZE, intensity);
          }
        }
      }
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("click", handleClick);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(frame);
    };
  }, [tone]);

  return <canvas ref={canvasRef} className="interactive-grid-canvas" aria-hidden="true" />;
}
