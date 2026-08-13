"use client";

import Button from "@/components/Button";

export default function HomeProductJump() {
  const focusProductHeading = () => {
    window.setTimeout(() => {
      document.getElementById("product-family-title")?.focus({ preventScroll: true });
    }, 520);
  };

  return (
    <Button href="#products" size="lg" className="phase-one-hero__cta" onClick={focusProductHeading}>
      选择产品
    </Button>
  );
}
