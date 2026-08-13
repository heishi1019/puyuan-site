"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";

const products = [
  {
    id: "scholar",
    name: "科小文",
    nameEn: "ScholarPilot Agent",
    positioning: "AI 科研工作台 · 内测中",
    description: "以科研项目为单位组织文献、证据、文件和论文草稿。当前已有可演示原型，个人研究者可申请免费内测。",
    href: "/scholarpilot",
  },
  {
    id: "proposal",
    name: "智小申",
    nameEn: "ProposalPilot Agent",
    positioning: "企业项目申报 agent · 研发共创",
    description: "计划围绕政策发现、资格判断、材料规划、文本辅助和项目资产沉淀，邀请有真实申报经验的企业与服务人员参与共创。",
    href: "/proposalpilot",
  },
] as const;

export default function ProductMatrix() {
  const router = useRouter();

  const updateCardSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const edgeDistances = {
      left: pointerX,
      top: pointerY,
      right: bounds.width - pointerX,
      bottom: bounds.height - pointerY,
    };
    const nearestEdge = Object.entries(edgeDistances).reduce((nearest, edge) =>
      edge[1] < nearest[1] ? edge : nearest,
    );
    const edgeDistance = nearestEdge[1];
    const glowRange = Math.min(190, Math.min(bounds.width, bounds.height) * .42);
    const edgeOpacity = .22 + Math.max(0, Math.min(1, 1 - edgeDistance / glowRange)) * .78;
    const edgeX = nearestEdge[0] === "left"
      ? 0
      : nearestEdge[0] === "right"
        ? bounds.width
        : pointerX;
    const edgeY = nearestEdge[0] === "top"
      ? 0
      : nearestEdge[0] === "bottom"
        ? bounds.height
        : pointerY;

    event.currentTarget.style.setProperty("--matrix-card-x", `${pointerX}px`);
    event.currentTarget.style.setProperty("--matrix-card-y", `${pointerY}px`);
    event.currentTarget.style.setProperty("--matrix-edge-x", `${edgeX}px`);
    event.currentTarget.style.setProperty("--matrix-edge-y", `${edgeY}px`);
    event.currentTarget.style.setProperty("--matrix-edge-opacity", edgeOpacity.toFixed(3));
  };

  const resetCardSpotlight = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--matrix-card-x");
    event.currentTarget.style.removeProperty("--matrix-card-y");
    event.currentTarget.style.removeProperty("--matrix-edge-x");
    event.currentTarget.style.removeProperty("--matrix-edge-y");
    event.currentTarget.style.removeProperty("--matrix-edge-opacity");
  };

  const openProduct = (href: string) => {
    router.push(href);
  };

  const handleCardClick = (event: MouseEvent<HTMLElement>, href: string) => {
    if ((event.target as HTMLElement).closest("a")) return;
    if (window.getSelection()?.toString().trim()) return;
    openProduct(href);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>, href: string) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    openProduct(href);
  };

  return (
    <section id="products" className="phase-two-products home-color-page home-color-page--cover" data-page-theme="dark">
      <div className="phase-two-products__inner" data-cover-content>
        <header className="phase-two-products__heading">
          <h2 id="product-family-title" tabIndex={-1}>产品矩阵，面向真实专业任务</h2>
          <p>同一套产品方法进入不同专业任务，产品阶段与开放范围如实标注。</p>
        </header>

        <div className="phase-two-products__grid">
          {products.map((product) => (
            <article
              id={`product-${product.id}`}
              key={product.id}
              className="phase-two-product"
              role="link"
              tabIndex={0}
              aria-label={`了解${product.name} ${product.nameEn}`}
              onPointerMove={updateCardSpotlight}
              onPointerLeave={resetCardSpotlight}
              onClick={(event) => handleCardClick(event, product.href)}
              onKeyDown={(event) => handleCardKeyDown(event, product.href)}
            >
              <div className="phase-two-product__content">
                <h3>{product.name}</h3>
                <p className="phase-two-product__english">{product.nameEn}</p>
                <strong>{product.positioning}</strong>
                <p className="phase-two-product__description">{product.description}</p>
                <Link className="home-product-matrix-card__cta phase-two-product__link" href={product.href}>
                  <span>了解详情</span><ArrowUpRight size={21} weight="light" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
