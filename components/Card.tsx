import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds accent glow on hover */
  glowOnHover?: boolean;
}

export default function Card({ children, className = "", glowOnHover = false }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-border bg-surface p-6",
        glowOnHover ? "hover:border-accent/40 hover:shadow-glow transition-all duration-200" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
