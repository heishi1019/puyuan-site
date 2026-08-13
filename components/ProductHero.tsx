"use client";

import {
  Binoculars,
  BookOpenText,
  Buildings,
  CalendarCheck,
  ChartLineUp,
  CheckCircle,
  FileText,
  FolderOpen,
  ListBullets,
  MagnifyingGlass,
  Notebook,
  Package,
  PaperPlaneTilt,
  PencilSimpleLine,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

type ProductKind = "proposal" | "scholar";

type TopologyNode = {
  label: string;
  detail: string;
  icon: Icon;
};

type ProductHeroContent = {
  name: string;
  englishName: string;
  title: string;
  accent: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  facts: string[];
  inputs: TopologyNode[];
  outputs: TopologyNode[];
  hubLabels: [string, string, string, string];
};

const heroContent: Record<ProductKind, ProductHeroContent> = {
  proposal: {
    name: "智小申",
    englishName: "ProposalPilot Agent",
    title: "让复杂的项目申报，",
    accent: "成为可以看清和推进的过程",
    description:
      "面向企业政府项目申报，从机会发现、资格判断到材料定稿与节点提醒，持续核查真实证据，让关键决策始终有据可查。",
    primaryAction: {
      label: "申请成为共创用户",
      href: "mailto:hello@puyuan.tech?subject=ProposalPilot%20%E5%85%B1%E5%88%9B%E7%94%B3%E8%AF%B7",
    },
    secondaryAction: {
      label: "企业与机构合作",
      href: "mailto:hello@puyuan.tech?subject=ProposalPilot%20%E6%9C%BA%E6%9E%84%E5%90%88%E4%BD%9C",
    },
    facts: ["跨 200 页材料核查", "6 大类 / 14 项检查", "G4 人工定稿"],
    inputs: [
      { label: "企业材料", detail: "主体信息与经营资料", icon: Buildings },
      { label: "已有资质", detail: "证书与认定依据", icon: ShieldCheck },
      { label: "历史申报", detail: "版本与既有结论", icon: FolderOpen },
      { label: "政策指南", detail: "条件、窗口与口径", icon: FileText },
      { label: "项目计划", detail: "目标、预算与节点", icon: CalendarCheck },
    ],
    outputs: [
      { label: "机会清单", detail: "主管部门与优先级", icon: Binoculars },
      { label: "资格判断", detail: "硬门槛与材料缺口", icon: CheckCircle },
      { label: "证据链", detail: "主张与材料映射", icon: ChartLineUp },
      { label: "申报档案", detail: "定稿版本与节点提醒", icon: Package },
    ],
    hubLabels: ["匹配", "核对", "追溯", "门控"],
  },
  scholar: {
    name: "科小文",
    englishName: "ScholarPilot Agent",
    title: "让研究材料，在同一项目中",
    accent: "持续成为可审阅的写作过程",
    description:
      "围绕选题、文献综述、初稿生成、润色与投稿准备组织研究工作；研究真实性、学术判断与最终决定始终由研究者掌握。",
    primaryAction: {
      label: "申请免费内测",
      href: "mailto:hello@puyuan.tech?subject=ScholarPilot%20%E5%85%8D%E8%B4%B9%E5%86%85%E6%B5%8B%E7%94%B3%E8%AF%B7",
    },
    secondaryAction: {
      label: "机构试用与合作",
      href: "mailto:hello@puyuan.tech?subject=ScholarPilot%20%E6%9C%BA%E6%9E%84%E8%AF%95%E7%94%A8%E4%B8%8E%E5%90%88%E4%BD%9C",
    },
    facts: ["选题与文献综述", "初稿生成", "润色与投稿准备", "关键判断归研究者"],
    inputs: [
      { label: "研究问题", detail: "目标与问题边界", icon: MagnifyingGlass },
      { label: "已有文献", detail: "论文与综述材料", icon: BookOpenText },
      { label: "阅读笔记", detail: "摘录、观点与来源", icon: Notebook },
      { label: "写作要求", detail: "结构与表达边界", icon: ListBullets },
      { label: "论文草稿", detail: "研究者已有内容", icon: PencilSimpleLine },
    ],
    outputs: [
      { label: "综述方向", detail: "主题关系与问题脉络", icon: BookOpenText },
      { label: "初稿结构", detail: "章节与待回答问题", icon: ListBullets },
      { label: "可修订初稿", detail: "保留研究者判断", icon: PencilSimpleLine },
      { label: "投稿准备", detail: "文本与格式整理", icon: PaperPlaneTilt },
    ],
    hubLabels: ["梳理", "关联", "组织", "校对"],
  },
};

const inputPaths = [
  "M175 52 H282 C360 52 350 220 456 220",
  "M175 136 H300 C372 136 370 220 456 220",
  "M175 220 H456",
  "M175 304 H300 C372 304 370 220 456 220",
  "M175 388 H282 C360 388 350 220 456 220",
];

const outputPaths = [
  "M544 220 H696 C760 220 750 70 825 70",
  "M544 220 H714 C770 220 770 170 825 170",
  "M544 220 H714 C770 220 770 270 825 270",
  "M544 220 H696 C760 220 750 370 825 370",
];

const scholarFlowCards = [
  { title: "研究工作流", detail: "文献、证据与写作过程持续留在同一个研究项目中", icon: BookOpenText, href: "#applications" },
  { title: "当前可演示能力", detail: "覆盖研究设计、文献证据整理与论文写作修改", icon: FileText, href: "#capabilities" },
  { title: "建设进度与边界", detail: "区分已开放、持续建设与规划能力，不把方向写成承诺", icon: PaperPlaneTilt, href: "#roadmap" },
];

function ScholarFeatureChain() {
  return (
    <div className="scholar-feature-chain" aria-label="科小文可演示能力流程">
      {scholarFlowCards.map(({ title, detail, icon: IconComponent, href }) => (
        <a className="scholar-feature-chain__card" href={href} aria-label={`${title}，跳转到对应内容`} key={title}>
          <span className="scholar-feature-chain__icon"><IconComponent size={24} weight="light" aria-hidden="true" /></span>
          <h2>{title}</h2>
          <p>{detail}</p>
        </a>
      ))}
    </div>
  );
}

export default function ProductHero({ product }: { product: ProductKind }) {
  const content = heroContent[product];
  const [activeInput, setActiveInput] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const topologyRef = useRef<HTMLDivElement>(null);
  const incomingPayloadRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const outgoingPayloadRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval: number | undefined;

    const stop = () => {
      if (interval) window.clearInterval(interval);
      interval = undefined;
    };

    const start = () => {
      if (reducedMotion.matches || isPaused) return;
      interval = window.setInterval(() => {
        setActiveInput((current) => (current + 1) % content.inputs.length);
      }, 5200);
    };

    const syncMotionPreference = () => {
      stop();
      if (reducedMotion.matches) setActiveInput(0);
      start();
    };

    start();
    reducedMotion.addEventListener("change", syncMotionPreference);
    return () => {
      stop();
      reducedMotion.removeEventListener("change", syncMotionPreference);
    };
  }, [content.inputs.length, isPaused]);

  const activeRoutes = [
    { input: activeInput, output: activeInput % content.outputs.length },
    { input: (activeInput + 2) % content.inputs.length, output: (activeInput + 1) % content.outputs.length },
    { input: (activeInput + 4) % content.inputs.length, output: (activeInput + 2) % content.outputs.length },
  ];
  const activeInputIndices = activeRoutes.map((route) => route.input);
  const activeOutputIndices = activeRoutes.map((route) => route.output);

  useEffect(() => {
    const topology = topologyRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!topology || reducedMotion.matches) return;

    const topologyBounds = topology.getBoundingClientRect();
    const pathKeyframes = (path: SVGPathElement, startScale: number, endScale: number) => {
      const length = path.getTotalLength();
      const sampleCount = 28;
      return Array.from({ length: sampleCount }, (_, index) => {
        const progress = index / (sampleCount - 1);
        const point = path.getPointAtLength(length * progress);
        const scale = startScale + (endScale - startScale) * progress;
        const opacity = progress < 0.06 || progress > 0.94 ? 0 : 1;
        return {
          offset: progress,
          opacity,
          transform: `translate3d(${point.x / 1000 * topologyBounds.width - 14}px, ${point.y / 440 * topologyBounds.height - 14}px, 0) scale(${scale})`,
        };
      });
    };

    const animations: Animation[] = [];
    activeRoutes.forEach((route, index) => {
      const incomingPayload = incomingPayloadRefs.current[index];
      const outgoingPayload = outgoingPayloadRefs.current[index];
      const inputPath = topology.querySelector<SVGPathElement>(`[data-topology-input-path="${route.input}"]`);
      const outputPath = topology.querySelector<SVGPathElement>(`[data-topology-output-path="${route.output}"]`);
      if (!incomingPayload || !outgoingPayload || !inputPath || !outputPath) return;

      animations.push(incomingPayload.animate(
        pathKeyframes(inputPath, 0.82, 0.54),
        { delay: index * 260, duration: 1800, easing: "cubic-bezier(.45,0,.2,1)", fill: "both" },
      ));
      animations.push(outgoingPayload.animate(
        pathKeyframes(outputPath, 0.54, 0.82),
        { delay: 1750 + index * 300, duration: 1900, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
      ));
    });

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [activeInput]);

  return (
    <section
      className="product-hero"
      data-product-hero={product}
      data-page-theme="light"
      data-scholar-theme="light"
    >
      <div className="product-hero__inner">
        <header className="product-hero__copy">
          <p className="product-hero__name"><span>{content.name}</span>{content.englishName}</p>
          <h1>{content.title}<br /><span>{content.accent}</span></h1>
          <p className="product-hero__description">{content.description}</p>
          <div className="product-hero__actions">
            <Button href={content.primaryAction.href} size="lg">{content.primaryAction.label}</Button>
            <Button href={content.secondaryAction.href} variant="secondary" size="lg">{content.secondaryAction.label}</Button>
          </div>
        </header>

        {product === "scholar" ? <ScholarFeatureChain /> : (<div
          className="product-topology"
          ref={topologyRef}
          tabIndex={0}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          aria-label={`${content.name}：多源材料经过中心处理后形成专业成果`}
        >
          <svg className="product-topology__lines" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
            {inputPaths.map((path, index) => (
              <path key={path} d={path} data-topology-input-path={index} className={activeInputIndices.includes(index) ? "is-active" : undefined} />
            ))}
            {outputPaths.map((path, index) => (
              <path key={path} d={path} data-topology-output-path={index} className={activeOutputIndices.includes(index) ? "is-active" : undefined} />
            ))}
          </svg>

          <div className="product-topology__nodes product-topology__nodes--input">
            {content.inputs.map(({ label, detail, icon: IconComponent }, index) => (
              <div className={`product-topology__node${activeInputIndices.includes(index) ? " is-active" : ""}`} data-topology-input={index} key={label}>
                <IconComponent size={16} weight="regular" aria-hidden="true" />
                <span><strong>{label}</strong><small>{detail}</small></span>
              </div>
            ))}
          </div>

          <div className={`product-topology__hub is-step-${activeInput % content.hubLabels.length}`} aria-hidden="true">
            <span className="product-topology__petal product-topology__petal--top"><b>{content.hubLabels[0]}</b></span>
            <span className="product-topology__petal product-topology__petal--right"><b>{content.hubLabels[1]}</b></span>
            <span className="product-topology__petal product-topology__petal--bottom"><b>{content.hubLabels[2]}</b></span>
            <span className="product-topology__petal product-topology__petal--left"><b>{content.hubLabels[3]}</b></span>
            <span className="product-topology__core">
              <strong className="product-topology__core-name">{content.name}</strong>
            </span>
          </div>

          <div className="product-topology__nodes product-topology__nodes--output">
            {content.outputs.map(({ label, detail, icon: IconComponent }, index) => (
              <div className={`product-topology__node${activeOutputIndices.includes(index) ? " is-active" : ""}`} data-topology-output={index} key={label}>
                <IconComponent size={16} weight="regular" aria-hidden="true" />
                <span><strong>{label}</strong><small>{detail}</small></span>
              </div>
            ))}
          </div>
          {activeRoutes.map((route, payloadIndex) => {
            const PayloadIcon = content.inputs[route.input].icon;
            return (
              <span
                className="product-topology__payload product-topology__payload--incoming"
                ref={(element) => { incomingPayloadRefs.current[payloadIndex] = element; }}
                aria-hidden="true"
                key={`incoming-${payloadIndex}`}
              >
                <PayloadIcon size={14} weight="regular" />
              </span>
            );
          })}
          {activeRoutes.map((_, payloadIndex) => (
            <span
              className="product-topology__payload product-topology__payload--outgoing"
              ref={(element) => { outgoingPayloadRefs.current[payloadIndex] = element; }}
              aria-hidden="true"
              key={`outgoing-${payloadIndex}`}
            >
              <CheckCircle size={15} weight="fill" />
            </span>
          ))}
        </div>)}

        <ul className="product-hero__facts" aria-label={`${content.name} 关键事实`}>
          {content.facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      </div>
    </section>
  );
}
