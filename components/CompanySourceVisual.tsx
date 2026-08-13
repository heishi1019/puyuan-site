"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

export default function CompanySourceVisual() {
  const updateLight = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--source-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--source-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div className="company-source-visual" onPointerMove={updateLight} role="img" aria-label="专业知识经过工作流进入企业申报与学术写作场景">
      <div className="company-source-visual__head">
        <span>PUYUAN / SOURCE SYSTEM</span>
        <strong>KNOWLEDGE TO DELIVERY</strong>
      </div>
      <div className="company-source-visual__canvas">
        <div className="company-source-visual__grid" aria-hidden="true" />
        <div className="company-source-visual__halo" aria-hidden="true" />
        <span className="company-source-visual__line company-source-visual__line--knowledge" aria-hidden="true" />
        <span className="company-source-visual__line company-source-visual__line--workflow" aria-hidden="true" />
        <span className="company-source-visual__line company-source-visual__line--proposal" aria-hidden="true" />
        <span className="company-source-visual__line company-source-visual__line--scholar" aria-hidden="true" />

        <div className="company-source-visual__core">
          <span><Image src="/logo-mark.svg" alt="" width={44} height={44} /></span>
          <strong>溥源</strong>
          <small>专业 agent 源点</small>
        </div>
        <div className="company-source-visual__node company-source-visual__node--knowledge"><small>INPUT</small><strong>专业知识</strong></div>
        <div className="company-source-visual__node company-source-visual__node--workflow"><small>METHOD</small><strong>智能工作流</strong></div>
        <div className="company-source-visual__node company-source-visual__node--proposal"><small>AGENT 01</small><strong>企业申报</strong></div>
        <div className="company-source-visual__node company-source-visual__node--scholar"><small>AGENT 02</small><strong>学术写作</strong></div>
      </div>
      <div className="company-source-visual__foot"><span>场景驱动</span><span>人机协同</span><span>持续扩展</span></div>
    </div>
  );
}
