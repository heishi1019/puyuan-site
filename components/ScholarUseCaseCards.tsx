"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    label: "研究者",
    title: <>个人研究<br />持续推进</>,
    description: "带着真实任务申请内测，在项目中整理文献、证据与论文草稿。",
  },
  {
    label: "机构",
    title: <>团队试用<br />共同校准</>,
    description: "围绕成员协作、试用范围与数据边界开展沟通，按版本确定可用能力。",
  },
];

type MotionState = {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
};

export default function ScholarUseCaseCards() {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reducedMotion.matches || !finePointer.matches) return;

    const states: MotionState[] = cardRefs.current.map(() => ({
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    }));
    let frame = 0;

    const render = () => {
      let moving = false;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const state = states[index];
        state.currentX += (state.targetX - state.currentX) * 0.105;
        state.currentY += (state.targetY - state.currentY) * 0.105;

        if (Math.abs(state.targetX - state.currentX) > 0.008 || Math.abs(state.targetY - state.currentY) > 0.008) {
          moving = true;
        }

        card.style.setProperty("--use-card-rx", `${(-state.currentY * 5.4).toFixed(3)}deg`);
        card.style.setProperty("--use-card-ry", `${(state.currentX * 6.8).toFixed(3)}deg`);
        card.style.setProperty("--use-card-shift-x", `${(state.currentX * 5).toFixed(2)}px`);
        card.style.setProperty("--use-card-shift-y", `${(state.currentY * 4).toFixed(2)}px`);
      });

      frame = moving ? window.requestAnimationFrame(render) : 0;
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const cleanups = cardRefs.current.map((card, index) => {
      if (!card) return () => undefined;
      const state = states[index];

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        state.targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        state.targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        card.style.setProperty("--use-card-light-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--use-card-light-y", `${event.clientY - bounds.top}px`);
        card.dataset.active = "true";
        requestRender();
      };

      const handlePointerLeave = () => {
        state.targetX = 0;
        state.targetY = 0;
        delete card.dataset.active;
        requestRender();
      };

      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerleave", handlePointerLeave);
      };
    });

    return () => {
      window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="scholar-use-cases">
      {cards.map((card, index) => (
        <article
          key={card.label}
          ref={(element) => { cardRefs.current[index] = element; }}
          className="scholar-use-card"
        >
          <div className="scholar-use-card__content">
            <span>{card.label}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
