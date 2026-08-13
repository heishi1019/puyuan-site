"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

const targets = {
  proposal: "product-proposal",
  scholar: "product-scholar",
} as const;

function focusProduct(product: keyof typeof targets) {
  const card = document.getElementById(targets[product]);
  if (!card) return;

  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("is-source-target");
  window.requestAnimationFrame(() => card.classList.add("is-source-target"));

  window.setTimeout(() => {
    card.querySelector<HTMLElement>(".home-product-matrix-card__cta")?.focus({ preventScroll: true });
  }, 520);
  window.setTimeout(() => card.classList.remove("is-source-target"), 1000);
}

export default function HomeSourceNetwork() {
  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--proposal-x", `${x * -8}px`);
    event.currentTarget.style.setProperty("--proposal-y", `${y * -6}px`);
    event.currentTarget.style.setProperty("--scholar-x", `${x * 8}px`);
    event.currentTarget.style.setProperty("--scholar-y", `${y * 6}px`);
    event.currentTarget.style.setProperty("--source-x", `${x * 3}px`);
    event.currentTarget.style.setProperty("--source-y", `${y * 3}px`);
  };

  const resetPointer = (event: PointerEvent<HTMLDivElement>) => {
    ["--proposal-x", "--proposal-y", "--scholar-x", "--scholar-y", "--source-x", "--source-y"].forEach((property) => {
      event.currentTarget.style.setProperty(property, "0px");
    });
  };

  return (
    <div className="home-source-network" onPointerMove={updatePointer} onPointerLeave={resetPointer}>
      <span className="home-source-network__line home-source-network__line--left" aria-hidden="true" />
      <span className="home-source-network__line home-source-network__line--right" aria-hidden="true" />

      <button className="home-source-network__node home-source-network__node--proposal" type="button" onClick={() => focusProduct("proposal")}>
        <span>企业项目申报</span>
        <strong>智小申</strong>
        <small>ProposalPilot Agent</small>
      </button>

      <div className="home-source-network__source" aria-label="溥源智能专业 agent 源点">
        <span className="home-source-network__pulse" aria-hidden="true" />
        <Image
          className="home-source-network__mark"
          src="/brand-logo-mark.png"
          alt=""
          width={512}
          height={512}
          aria-hidden="true"
          priority
        />
        <strong>溥源</strong>
      </div>

      <button className="home-source-network__node home-source-network__node--scholar" type="button" onClick={() => focusProduct("scholar")}>
        <span>学术写作</span>
        <strong>科小文</strong>
        <small>ScholarPilot Agent</small>
      </button>
    </div>
  );
}
