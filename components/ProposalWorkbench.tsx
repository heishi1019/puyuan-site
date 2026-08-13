"use client";

import { useEffect, useRef, useState } from "react";

export type ProposalStage = {
  title: string;
  short: string;
  detail: string;
  metric: string;
  metricLabel: string;
};

const problemStages: ProposalStage[] = [
  {
    title: "少漏机会",
    short: "发现机会",
    detail: "按企业画像持续匹配政策窗口，把值得判断的机会放到同一条清晰队列。",
    metric: "150+",
    metricLabel: "项目类型覆盖",
  },
  {
    title: "资格判断更清楚",
    short: "诊断资格",
    detail: "把政策门槛拆成可核验条件，标出已满足、缺失与需要补强的依据。",
    metric: "G1–G6",
    metricLabel: "人工门控留痕",
  },
  {
    title: "材料前后一致",
    short: "证据核查",
    detail: "跨文件追踪数字、主张与来源，提前发现矛盾和断裂的证据链。",
    metric: "200+",
    metricLabel: "页材料核查",
  },
];

const stageRows = [
  ["01", "发现机会", "机会队列", "少漏机会"],
  ["02", "诊断资格", "资格清单", "资格判断更清楚"],
  ["03", "编制材料", "证据写作", "真实依据进入正文"],
  ["04", "质检定稿", "一致性核查", "材料前后一致"],
  ["05", "申报陪伴", "节点提醒", "持续跟进"],
];

export function ProposalProblemSwitcher() {
  const [active, setActive] = useState(0);
  const current = problemStages[active];

  return (
    <div className="proposal-switcher">
      <div className="proposal-switcher__tabs" role="tablist" aria-label="智小申解决的问题">
        {problemStages.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`proposal-solution-${index}`}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <div className="proposal-switcher__panel" id={`proposal-solution-${active}`} role="tabpanel">
        <div className="proposal-switcher__copy">
          <p className="proposal-kicker">当前解法 / {current.short}</p>
          <h3>{current.detail}</h3>
          <div className="proposal-switcher__result"><span />{current.title}</div>
        </div>
        <div className="proposal-workbench proposal-workbench--dark" aria-label={`${current.short}功能示意界面`}>
          <div className="proposal-workbench__bar"><span className="proposal-workbench__brand">智小申</span><span>申报工作台</span><i /></div>
          <div className="proposal-workbench__body">
            <div className="proposal-workbench__rail"><span className="is-current" /><span /><span /><span /><span /></div>
            <div className="proposal-workbench__main">
              <div className="proposal-workbench__headline"><span>{current.short}</span><b>{current.metric}</b></div>
              <div className="proposal-workbench__rows">
                <div><span>企业画像</span><em className="is-ok">已同步</em></div>
                <div><span>{active === 2 ? "证据链" : "政策条件"}</span><em className="is-warn">待核验</em></div>
                <div><span>人工确认</span><em>下一步</em></div>
              </div>
            </div>
            <div className="proposal-workbench__graph"><span /><span /><span /><b /><i /><i /></div>
          </div>
          <div className="proposal-workbench__footer"><span>{current.metricLabel}</span><span>示意界面</span></div>
        </div>
      </div>
    </div>
  );
}

export function ProposalWorkflowScroll() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = stageRows[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth <= 900 || reduced.matches) return;
      const rect = root.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight * 0.72);
      const progress = Math.min(0.999, Math.max(0, (150 - rect.top) / range));
      setActive(Math.floor(progress * stageRows.length));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const selectStage = (index: number) => {
    setActive(index);
    const root = rootRef.current;
    if (!root || window.innerWidth <= 900) return;
    const top = window.scrollY + root.getBoundingClientRect().top;
    const range = Math.max(1, root.offsetHeight - window.innerHeight * 0.72);
    window.scrollTo({ top: top + (range * index) / (stageRows.length - 1), behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="proposal-scroll-workflow">
      <div className="proposal-scroll-workflow__nav" role="tablist" aria-label="智小申五步工作流">
        {stageRows.map(([number, title, label], index) => (
          <button key={number} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => selectStage(index)}>
            <span>{number}</span><strong>{title}</strong><em>{label}</em>
          </button>
        ))}
      </div>
      <div className="proposal-scroll-workflow__visual">
        <div className="proposal-workbench proposal-workbench--light">
          <div className="proposal-workbench__bar"><span className="proposal-workbench__brand">智小申</span><span>{current[2]}</span><i /></div>
          <div className="proposal-workbench__body">
            <div className="proposal-workbench__rail"><span className={active >= 0 ? "is-current" : ""} /><span className={active >= 1 ? "is-current" : ""} /><span className={active >= 2 ? "is-current" : ""} /><span className={active >= 3 ? "is-current" : ""} /><span className={active >= 4 ? "is-current" : ""} /></div>
            <div className="proposal-workbench__main"><div className="proposal-workbench__headline"><span>{current[1]}</span><b>{String(active + 1).padStart(2, "0")} / 05</b></div><div className="proposal-workbench__rows"><div><span>系统动作</span><em className="is-ok">进行中</em></div><div><span>企业确认</span><em className={active === 3 ? "is-warn" : ""}>{active === 3 ? "必须确认" : "待安排"}</em></div><div><span>阶段交付</span><em>已留痕</em></div></div></div>
            <div className="proposal-workbench__graph"><span /><span /><span /><b /><i /><i /></div>
          </div>
          <div className="proposal-workbench__footer"><span>{current[3]}</span><span>示意界面</span></div>
        </div>
        <p className="proposal-scroll-workflow__caption">系统推进任务，人只在关键节点做决定。</p>
      </div>
    </div>
  );
}
