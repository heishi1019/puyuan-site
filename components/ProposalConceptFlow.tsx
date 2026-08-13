"use client";

import { useEffect, useRef, useState } from "react";
import {
  Archive,
  BellRinging,
  ChartLineUp,
  ClipboardText,
  FileMagnifyingGlass,
  ListChecks,
  MagnifyingGlass,
  PencilSimpleLine,
  type Icon,
} from "@phosphor-icons/react";
import styles from "./ProposalConceptFlow.module.css";

const stages = [
  {
    number: "01",
    label: "OPPORTUNITY SCAN",
    title: "项目与政策发现",
    description: "整理值得进一步核对的政策、项目和申报窗口。",
    source: "政策、项目与申报窗口",
    result: "待核对机会清单",
    icon: MagnifyingGlass,
  },
  {
    number: "02",
    label: "ELIGIBILITY CHECK",
    title: "资格初步检查",
    description: "把申报条件拆成检查项，标出已有依据和待确认缺口。",
    source: "申报条件与企业资料",
    result: "资格缺口清单",
    icon: ClipboardText,
  },
  {
    number: "03",
    label: "GUIDELINE REVIEW",
    title: "指南解读",
    description: "提取对象、条件、材料、时间和主管部门等关键要求。",
    source: "指南原文与时间要求",
    result: "核心要求提要",
    icon: FileMagnifyingGlass,
  },
  {
    number: "04",
    label: "TASK PLANNING",
    title: "材料与任务规划",
    description: "围绕真实团队分工组织材料清单、负责人和时间节点。",
    source: "企业资料与团队分工",
    result: "材料与任务清单",
    icon: ListChecks,
  },
  {
    number: "05",
    label: "DRAFT PREP",
    title: "文本辅助起草",
    description: "依据企业提供的真实材料形成可修改草稿，不补造事实。",
    source: "企业提供的真实材料",
    result: "可修改文本草稿",
    icon: PencilSimpleLine,
  },
  {
    number: "06",
    label: "CONSISTENCY CHECK",
    title: "指标一致性检查",
    description: "检查关键指标、材料和文本之间是否存在明显冲突。",
    source: "指标、材料与文本",
    result: "待复核冲突项",
    icon: ChartLineUp,
  },
  {
    number: "07",
    label: "MILESTONE ALERT",
    title: "节点提醒",
    description: "整理截止时间、内部确认和提交前待办事项。",
    source: "截止时间与内部确认",
    result: "提交前待办事项",
    icon: BellRinging,
  },
  {
    number: "08",
    label: "PROJECT ARCHIVE",
    title: "项目资产沉淀",
    description: "归档材料版本、项目记录和后续可以复用的企业资料。",
    source: "材料版本与项目记录",
    result: "可复用项目档案",
    icon: Archive,
  },
] satisfies Array<{
  number: string;
  label: string;
  title: string;
  description: string;
  source: string;
  result: string;
  icon: Icon;
}>;

export default function ProposalConceptFlow() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || isPaused) return;

    const timer = window.setTimeout(() => {
      setActive((active + 1) % stages.length);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [active, isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRefs.current[active];
    if (!track || !stage) return;

    track.scrollTo({
      left: Math.max(0, stage.offsetLeft - track.clientWidth / 2 + stage.clientWidth / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className={styles.viewport} aria-label="智小申规划工作链概念示意">
      <div
        ref={trackRef}
        className={styles.track}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
      >
        {stages.map(({ number, label, title, description, source, result, icon: Icon }, index) => (
          <article
            key={number}
            ref={(element) => { stageRefs.current[index] = element; }}
            className={styles.stage}
            data-active={active === index}
            aria-current={active === index ? "step" : undefined}
            role="button"
            tabIndex={0}
            aria-label={`切换到第 ${index + 1} 个环节：${title}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              setActive(index);
            }}
          >
            <header className={styles.stageHeader}>
              <span>{number} / 08</span>
              <small>{label}</small>
            </header>
            <div className={styles.stageSignal} aria-hidden="true">
              <Icon size={22} weight="light" />
              <i />
            </div>
            <div className={styles.stageCopy}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <dl className={styles.stageFacts}>
              <div>
                <dt>输入依据</dt>
                <dd>{source}</dd>
              </div>
              <div>
                <dt>阶段结果</dt>
                <dd>{result}</dd>
              </div>
            </dl>
            <footer className={styles.stageFooter}>
              <span>规划环节</span>
              <b aria-hidden="true">→</b>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
