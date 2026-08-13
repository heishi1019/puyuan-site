"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type GraphNode = {
  label: string;
  x: number;
  y: number;
};

const capabilities: ReadonlyArray<{
  number: string;
  title: string;
  description: string;
  graphLabel: string;
  nodes: ReadonlyArray<GraphNode>;
}> = [
  {
    number: "01",
    title: "懂专业场景",
    description: "把政策、材料、评审规则和研究流程放进系统，而不是只提供一个通用聊天框。",
    graphLabel: "场景理解",
    nodes: [
      { label: "政策规则", x: 112, y: 92 },
      { label: "任务语境", x: 485, y: 82 },
      { label: "专业知识", x: 505, y: 316 },
      { label: "工作目标", x: 98, y: 322 },
    ],
  },
  {
    number: "02",
    title: "从流程到交付",
    description: "agent 贯穿信息收集、判断、编制和质检，人只在真正需要决策的节点介入。",
    graphLabel: "流程执行",
    nodes: [
      { label: "信息收集", x: 82, y: 205 },
      { label: "判断决策", x: 205, y: 68 },
      { label: "内容编制", x: 395, y: 340 },
      { label: "质量检查", x: 520, y: 205 },
    ],
  },
  {
    number: "03",
    title: "证据可以追溯",
    description: "每个亮点和结论都回到来源材料，缺少依据的内容不会被悄悄写进正式交付物。",
    graphLabel: "证据追溯",
    nodes: [
      { label: "来源材料", x: 92, y: 88 },
      { label: "事实核查", x: 104, y: 322 },
      { label: "结论映射", x: 478, y: 90 },
      { label: "交付结果", x: 512, y: 316 },
    ],
  },
  {
    number: "04",
    title: "数据边界清楚",
    description: "支持私有化部署；云端方案按约定不保存、不训练，并对传输过程加密。",
    graphLabel: "数据主权",
    nodes: [
      { label: "企业内网", x: 168, y: 68 },
      { label: "访问控制", x: 432, y: 68 },
      { label: "加密传输", x: 438, y: 340 },
      { label: "合规边界", x: 162, y: 340 },
    ],
  },
];

const source = { x: 300, y: 205, radius: 53 } as const;

function getLineStart(node: GraphNode) {
  const deltaX = node.x - source.x;
  const deltaY = node.y - source.y;
  const distance = Math.hypot(deltaX, deltaY);
  return {
    x: source.x + (deltaX / distance) * source.radius,
    y: source.y + (deltaY / distance) * source.radius,
  };
}

export default function HomeSystemGraph() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const active = capabilities[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex((current) => (current + 1) % capabilities.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, [isInView, isPaused]);

  useEffect(() => {
    if (!isInView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;

    const timers = active.nodes.map((_, index) => window.setTimeout(() => {
      const animations = stage.querySelectorAll<SVGAnimationElement>(
        `[data-connection-index="${index}"] animate, [data-connection-index="${index}"] animateMotion`,
      );
      animations.forEach((animation) => animation.beginElement());
    }, 720 + index * 920));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [active.nodes, activeIndex, isInView]);

  const selectCapability = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  return (
    <section id="system" ref={sectionRef} className="home-system" aria-labelledby="home-system-title">
      <div className="home-system__inner">
        <div className="home-system__intro">
          <p className="home-system__eyebrow">Why PuYuan</p>
          <h2 id="home-system-title" className="site-section-title">专业工作，必须有自己的系统</h2>
          <p>我们把边界写进流程，把证据放在结果旁边，把人的判断保留在关键位置。</p>
        </div>

        <div className="home-system__layout">
          <div className="home-system__graph" data-state={activeIndex} aria-hidden="true">
            <div className="home-system__graph-grid" />
            <div ref={stageRef} className={`home-system__stage${isInView ? " is-ready" : ""}`} key={activeIndex}>
              <svg className="home-system__canvas" viewBox="0 0 600 410" role="presentation">
                <g className="home-system__connections">
                  {active.nodes.map((node, index) => {
                    const start = getLineStart(node);
                    const path = `M${start.x} ${start.y} L${node.x} ${node.y}`;
                    return (
                      <g key={node.label} data-connection-index={index} style={{ "--path-index": index } as CSSProperties}>
                        <path
                          className="home-system__link home-system__link--base"
                          d={path}
                          pathLength="1"
                          opacity="0"
                          strokeDasharray="1"
                          strokeDashoffset="1"
                        >
                          <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="indefinite" fill="freeze" />
                          <animate
                            attributeName="stroke-dashoffset"
                            from="1"
                            to="0"
                            dur="0.72s"
                            begin="indefinite"
                            calcMode="spline"
                            keyTimes="0;1"
                            keySplines=".65 0 .35 1"
                            fill="freeze"
                          />
                        </path>
                        <path className="home-system__link home-system__link--flow" d={path} pathLength="1" />
                        <path
                          className="home-system__direction"
                          d="M -13 -6 L 4 0 L -13 6 L -8 0 Z"
                          opacity="0"
                        >
                          <animateMotion
                            path={path}
                            dur="0.72s"
                            begin="indefinite"
                            rotate="auto"
                            calcMode="spline"
                            keyTimes="0;1"
                            keySplines=".65 0 .35 1"
                            fill="freeze"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.04;0.94;1"
                            dur="0.72s"
                            begin="indefinite"
                            fill="freeze"
                          />
                        </path>
                      </g>
                    );
                  })}
                </g>

                <g className="home-system__source" transform={`translate(${source.x} ${source.y})`}>
                  <circle className="home-system__source-wave home-system__source-wave--outer" r="62" />
                  <circle className="home-system__source-wave home-system__source-wave--inner" r="51" />
                  <circle className="home-system__source-disc" r="42" />
                  <text className="home-system__source-kicker" textAnchor="middle" y="-10">PUYUAN</text>
                  <text className="home-system__source-mark" textAnchor="middle" y="15">源</text>
                  <text className="home-system__source-label" textAnchor="middle" y="84">{active.graphLabel}</text>
                </g>

                {active.nodes.map((node, index) => {
                  const isLeft = node.x < source.x;
                  return (
                    <g
                      key={node.label}
                      className="home-system__node"
                      transform={`translate(${node.x} ${node.y})`}
                      style={{ "--node-index": index } as CSSProperties}
                    >
                      <circle className="home-system__node-halo" r="15" />
                      <circle className="home-system__node-shell" r="8" />
                      <circle className="home-system__node-core" r="3" />
                      <text
                        className="home-system__node-label"
                        x={isLeft ? -20 : 20}
                        y="4"
                        textAnchor={isLeft ? "end" : "start"}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="home-system__graph-caption"><span>PY / SYSTEM</span>连接从源点生成，节点依次确认</p>
          </div>

          <div className="home-system__accordion" role="list" aria-label="溥源系统能力">
            {capabilities.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div key={item.title} className={`home-system__item${isActive ? " is-active" : ""}`} role="listitem">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`home-system-panel-${index}`}
                    onClick={() => selectCapability(index)}
                    onFocus={() => selectCapability(index)}
                  >
                    <span className="home-system__number">{item.number}</span>
                    <span className="home-system__item-title">{item.title}</span>
                    <span className="home-system__toggle" aria-hidden>{isActive ? "−" : "+"}</span>
                  </button>
                  <div id={`home-system-panel-${index}`} className="home-system__panel" aria-hidden={!isActive}>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
