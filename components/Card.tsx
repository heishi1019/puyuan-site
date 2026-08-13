"use client";

import { type PointerEvent, type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  spotlight?: boolean;
}

export default function Card({ children, className = "", glowOnHover = false, spotlight = false }: CardProps) {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!spotlight) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={[
        "rounded-md border border-border bg-surface p-6",
        glowOnHover ? "transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-glow" : "",
        spotlight ? "spotlight-card" : "",
        className,
      ].join(" ")}
    >
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
