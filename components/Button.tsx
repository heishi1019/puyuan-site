import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

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
  primary: "bg-accent text-bg font-semibold hover:bg-accent-hover hover:shadow-glow",
  secondary: "border border-border bg-surface/50 text-text hover:border-accent/60 hover:text-accent",
  ghost: "text-muted hover:text-text",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-md px-4 py-2 text-sm",
  md: "rounded-md px-5 py-2.5 text-sm",
  lg: "rounded-md px-6 py-3 text-base",
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
    "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </Link>
    );
  }

  return <button type={type} className={classes} onClick={onClick}>{children}</button>;
}
