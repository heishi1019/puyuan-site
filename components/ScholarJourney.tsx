"use client";

import { Books, CheckCircle, FileText, PaperPlaneTilt, type Icon } from "@phosphor-icons/react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import styles from "./ScholarJourney.module.css";

type Stage = { label: string; title: string; description: string; meta: string; icon: Icon };

const stages: Stage[] = [
  { label: "01 / DEMONSTRABLE", title: "选题、研究设计与文献综述", description: "从研究方向开始整理问题、研究路径和文献脉络，并保留可回查的证据线索。", meta: "内测可演示 / 研究框架", icon: Books },
  { label: "02 / DEMONSTRABLE", title: "论文写作与修改", description: "按研究者确认的材料组织章节与草稿，把零散思路推进成可持续修改的文档。", meta: "内测可演示 / 可编辑草稿", icon: FileText },
  { label: "03 / IN DEVELOPMENT", title: "投稿、返修与审稿回复", description: "围绕投稿准备、修改意见和回复结构继续建设，实际开放范围以当前内测版本为准。", meta: "持续建设 / 用户确认", icon: PaperPlaneTilt },
];

function Paper({ active }: { active: number }) {
  const updateTilt = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
    const vertical = (event.clientY - bounds.top) / bounds.height - .5;

    event.currentTarget.style.setProperty("--manuscript-tilt-x", `${(-vertical * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--manuscript-tilt-y", `${(horizontal * 7).toFixed(2)}deg`);
  };

  const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--manuscript-tilt-x");
    event.currentTarget.style.removeProperty("--manuscript-tilt-y");
  };

  return <div className={styles.manuscriptFrame} data-stage={active} onPointerMove={updateTilt} onPointerLeave={resetTilt}>
    <div className={styles.frameHeader}><span>SCHOLARPILOT / RESEARCH NOTE</span><span>0{active + 1} / 03</span></div>
    <div className={styles.paperStack}><span className={styles.paperBack} /><span className={styles.paperMiddle} /><div className={styles.paper}>
      <div className={styles.paperMargin} />
      <div className={styles.documentState} data-visible={active === 0}><span>研究框架 / 内测可演示</span><h3>把研究方向整理成<br />可以检查的研究问题</h3><div className={styles.keywordRow}><b>研究设计</b><b>文献线索</b><b>证据摘录</b></div><div className={styles.citationList}><p><b>[01]</b>梳理已有研究的主要脉络</p><p><b>[02]</b>记录证据、来源与待确认分歧</p><p><b>[03]</b>形成下一步可验证的研究问题</p></div></div>
      <div className={styles.documentState} data-visible={active === 1}><span>论文草稿 / 内测可演示</span><h3>从材料与证据到<br />持续修改的论文草稿</h3><ol className={styles.outlineList}><li><b>01</b>研究问题与背景</li><li><b>02</b>文献证据与研究方法</li><li><b>03</b>结果、讨论与限制</li></ol><i className={styles.typingCursor} /></div>
      <div className={styles.documentState} data-visible={active === 2}><span>投稿返修 / 持续建设</span><h3>整理修改意见，<br />关键回复由研究者确认</h3><div className={styles.revisionBlock}><p><b>意见</b>拆分审稿意见与修改任务</p><p><b>修改</b>关联对应段落与依据</p><p><b>回复</b>组织可检查的回复结构</p></div><div className={styles.confirmation}><CheckCircle size={18} weight="fill" />实际开放范围以版本为准</div></div>
    </div></div>
    <div className={styles.frameFooter}><span>研究者判断始终保留</span><i /></div>
  </div>;
}

export default function ScholarJourney() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);
  const manuscriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 901px)").matches) return;

    let frame = 0;
    const updateActiveStage = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const focusLine = window.innerHeight * .48;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        refs.current.forEach((element, index) => {
          if (!element) return;
          const bounds = element.getBoundingClientRect();
          const distance = Math.abs(bounds.top + bounds.height / 2 - focusLine);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        setActive((current) => current === nearestIndex ? current : nearestIndex);
      });
    };

    updateActiveStage();
    window.addEventListener("scroll", updateActiveStage, { passive: true });
    window.addEventListener("resize", updateActiveStage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveStage);
      window.removeEventListener("resize", updateActiveStage);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 901px)").matches) return;

    let frame = 0;
    const updatePaperPosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const container = manuscriptRef.current;
        if (!container) return;

        const bounds = container.getBoundingClientRect();
        const renderedFrame = container.firstElementChild as HTMLElement | null;
        const frameHeight = renderedFrame?.offsetHeight ?? Math.min(640, window.innerHeight - 190);
        const travel = Math.max(0, container.offsetHeight - frameHeight);
        const safeTop = Math.max(112, Math.min(156, window.innerHeight * .18));
        const offset = Math.min(travel, Math.max(0, safeTop - bounds.top));

        // Keep the manuscript immediately below the fixed navigation instead
        // of waiting for the viewport midpoint and re-rendering on each tick.
        renderedFrame?.style.setProperty("transform", `translate3d(0, ${offset.toFixed(2)}px, 0)`);
      });
    };

    updatePaperPosition();
    window.addEventListener("scroll", updatePaperPosition, { passive: true });
    window.addEventListener("resize", updatePaperPosition);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePaperPosition);
      window.removeEventListener("resize", updatePaperPosition);
    };
  }, []);

  return <section id="applications" className={styles.journeySection}>
    <div className={styles.sectionIntro}><p>一个项目，一份持续生长的稿件</p><h2>文献、证据与写作，<br />跟随研究过程一起向前</h2><span>从选题、文献阅读到论文修改，资料、证据与草稿持续沉淀在同一项目中；科小文协助整理与推进，研究判断和最终责任始终由研究者掌握。</span></div>
    <div className={styles.journeyLayout}><div className={styles.stageList}>
      {stages.map(({ label, title, description, meta, icon: StageIcon }, index) => <article key={title} ref={(element) => { refs.current[index] = element; }} data-index={index} data-active={active === index} className={styles.stage}><button type="button" onClick={() => { setActive(index); refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" }); }} aria-pressed={active === index}><span className={styles.stageIcon}><StageIcon size={22} /></span><span className={styles.stageCopy}><span className={styles.stageLabel}>{label}</span><strong>{title}</strong><span className={styles.stageDescription}>{description}</span><span className={styles.stageMeta}>{meta}</span></span></button></article>)}
    </div><div ref={manuscriptRef} className={styles.manuscriptSticky}><div><Paper active={active} /></div></div></div>
  </section>;
}
