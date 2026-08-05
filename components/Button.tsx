import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-bg font-semibold hover:bg-accent-hover glow-hover",
  secondary:
    "border border-border text-text hover:border-accent/60 hover:text-accent bg-transparent",
  ghost:
    "text-muted hover:text-text bg-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm rounded-md",
  md: "px-6 py-2.5 text-sm rounded-md",
  lg: "px-8 py-3   text-base rounded-md",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  external = false,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center transition-all duration-150 select-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
