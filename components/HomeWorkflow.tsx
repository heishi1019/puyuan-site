"use client";

import {
  CheckCircle,
  Compass,
  Package,
  Wrench,
} from "@phosphor-icons/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type WorkflowKey = "proposal" | "scholar";
type CopyPhase = "idle" | "leaving" | "entering";

type StorySnapshot = {
  workflow: WorkflowKey;
  stage: number;
  id: number;
};

const workflowCopy = {
  proposal: {
    label: "企业项目申报",
    stages: [
      {
        summary: "规划把企业信息、政策规则和已有材料放入同一任务上下文。",
        input: "企业基本信息、已有资质、历史申报材料",
        action: "共创验证如何整理主体、资质、项目与材料之间的关系，为后续判断建立可反查上下文。",
        output: "规划：企业画像与材料索引",
      },
      {
        summary: "持续匹配申报机会，识别窗口、主管部门和优先级。",
        input: "六类主管部门政策、申报窗口、企业画像",
        action: "计划匹配政策条件与企业现状，帮助团队筛出值得进一步核对的申报机会。",
        output: "规划：机会清单与优先级",
      },
      {
        summary: "结合硬门槛、企业现状和补强路径形成可执行诊断。",
        input: "申报条件、企业证据、材料缺口",
        action: "计划把申报条件拆成可检查条目；最终资格仍以官方文件、主管部门和专业人员意见为准。",
        output: "规划：资格检查与缺口项",
      },
      {
        summary: "规划材料清单、任务分工和文本辅助流程。",
        input: "申报指南、已有证据、编制中的材料",
        action: "计划协助组织材料清单、起草文本和检查关键指标的一致性，不补造缺失事实。",
        output: "规划：材料任务与待确认事项",
      },
      {
        summary: "规划归档材料、时间节点和可复用项目资产。",
        input: "质检结果、待确认事项、申报节点",
        action: "计划整理待确认事项、时间节点与材料版本；最终盖章、承诺和提交由企业负责。",
        output: "规划：项目档案与节点提醒",
      },
    ],
  },
  scholar: {
    label: "学术写作",
    stages: [
      {
        summary: "研究问题、已有资料与写作要求进入同一写作上下文。",
        input: "研究问题、已有资料、写作要求",
        action: "明确本次写作的目标、边界与可使用材料，建立统一写作上下文。",
        output: "写作上下文",
      },
      {
        summary: "梳理研究问题与相关文献，形成可继续推进的选题方向。",
        input: "研究问题与相关文献",
        action: "梳理文献之间的主题关系，帮助形成可继续推进的选题与综述方向。",
        output: "选题方向与文献脉络",
      },
      {
        summary: "组织文献脉络与写作结构，明确初稿需要回答的问题。",
        input: "文献脉络、写作目标、内容范围",
        action: "组织章节结构，明确初稿各部分需要回答的问题及内容次序。",
        output: "初稿结构",
      },
      {
        summary: "协助生成初稿，并围绕表达与结构进行润色。",
        input: "确认后的结构与已有资料",
        action: "按结构协助生成初稿，再围绕表达、衔接与章节结构进行润色。",
        output: "可继续修改的初稿",
      },
      {
        summary: "整理投稿前的文本与格式准备。",
        input: "论文初稿、格式要求、投稿准备事项",
        action: "整理文本与格式，完成投稿前准备，最终决定仍由研究者完成。",
        output: "投稿准备材料",
      },
    ],
  },
} as const;

const stages = [
  { title: "源点", icon: null },
  { title: "发现", icon: Compass },
  { title: "判断", icon: CheckCircle },
  { title: "执行", icon: Wrench },
  { title: "交付", icon: Package },
] as const;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

function WorkflowStory({
  workflow,
  stage,
  transition,
}: {
  workflow: WorkflowKey;
  stage: number;
  transition: "entering" | "leaving";
}) {
  const currentCopy = workflowCopy[workflow].stages[stage];

  return (
    <div
      className={`phase-two-workflow__story is-${transition}`}
      aria-hidden={transition === "leaving" ? true : undefined}
    >
      <div className="phase-two-workflow__story-phase">
        <span>{String(stage + 1).padStart(2, "0")} / 05</span>
        <h3>{stages[stage].title}</h3>
      </div>
      <div className="phase-two-workflow__story-input">
        <span>输入依据</span>
        <p>{currentCopy.input}</p>
      </div>
      <div className="phase-two-workflow__story-action">
        <span>Agent 动作</span>
        <p>{currentCopy.action}</p>
      </div>
      <div className="phase-two-workflow__story-output">
        <span>阶段成果</span>
        <strong>{currentCopy.output}</strong>
      </div>
    </div>
  );
}

export default function HomeWorkflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef(0);
  const storySnapshotRef = useRef<StorySnapshot>({
    workflow: "scholar",
    stage: 0,
    id: 0,
  });
  const copyTimerRef = useRef<number | null>(null);
  const storyTimerRef = useRef<number | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowKey>("scholar");
  const [displayedWorkflow, setDisplayedWorkflow] =
    useState<WorkflowKey>("scholar");
  const [copyPhase, setCopyPhase] = useState<CopyPhase>("idle");
  const [storySnapshot, setStorySnapshot] = useState<StorySnapshot>({
    workflow: "scholar",
    stage: 0,
    id: 0,
  });
  const [leavingStory, setLeavingStory] = useState<StorySnapshot | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const desktop = window.matchMedia("(min-width: 901px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const syncLinePlacement = () => {
      const track = sticky.querySelector<HTMLElement>(".phase-two-workflow__track");
      const markers = Array.from(
        sticky.querySelectorAll<HTMLElement>(".phase-two-workflow__marker"),
      );
      if (!track || markers.length < 2) return;

      const trackBounds = track.getBoundingClientRect();
      const firstBounds = markers[0].getBoundingClientRect();
      const lastBounds = markers[markers.length - 1].getBoundingClientRect();
      sticky.style.setProperty(
        "--workflow-line-left",
        `${(firstBounds.left + firstBounds.width / 2 - trackBounds.left).toFixed(2)}px`,
      );
      sticky.style.setProperty(
        "--workflow-line-right",
        `${(trackBounds.right - lastBounds.left - lastBounds.width / 2).toFixed(2)}px`,
      );
      sticky.style.setProperty(
        "--workflow-line-top",
        `${(firstBounds.top + firstBounds.height / 2 - trackBounds.top).toFixed(2)}px`,
      );
    };

    const setStage = (stage: number, lineProgress: number) => {
      const nextStage = clamp(stage, 0, stages.length - 1);
      sticky.dataset.workflowStage = String(nextStage);
      sticky.style.setProperty("--workflow-line-progress", lineProgress.toFixed(4));
      sticky.style.setProperty(
        "--workflow-segment",
        String(Math.min(nextStage, stages.length - 2)),
      );

      if (activeStageRef.current !== nextStage) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    const updateDesktop = () => {
      frame = 0;
      syncLinePlacement();
      const bounds = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-bounds.top / scrollDistance, 0, 1);
      const lineProgress = clamp(progress / .82, 0, 1);
      // A node changes only when the growing source beam reaches its center.
      const stage = Math.min(
        stages.length - 1,
        Math.floor(lineProgress * (stages.length - 1) + .001),
      );
      sticky.dataset.workflowPin =
        bounds.top > 0
          ? "before"
          : bounds.bottom <= window.innerHeight * .18
            ? "after"
            : "active";
      setStage(stage, lineProgress);
    };

    const requestDesktopUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateDesktop);
    };

    const updateMobile = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.62;
      const nodes = Array.from(
        sticky.querySelectorAll<HTMLElement>("[data-workflow-node]"),
      );
      let stage = 0;
      nodes.forEach((node, index) => {
        if (node.getBoundingClientRect().top <= threshold) stage = index;
      });
      setStage(stage, stage / (stages.length - 1));
    };

    const requestMobileUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateMobile);
    };

    const configure = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", requestDesktopUpdate);
      window.removeEventListener("resize", requestDesktopUpdate);
      window.removeEventListener("scroll", requestMobileUpdate);
      window.removeEventListener("resize", requestMobileUpdate);

      if (reducedMotion.matches) {
        delete sticky.dataset.workflowPin;
        setStage(stages.length - 1, 1);
        return;
      }

      if (desktop.matches) {
        updateDesktop();
        window.addEventListener("scroll", requestDesktopUpdate, { passive: true });
        window.addEventListener("resize", requestDesktopUpdate);
        return;
      }

      updateMobile();
      delete sticky.dataset.workflowPin;
      window.addEventListener("scroll", requestMobileUpdate, { passive: true });
      window.addEventListener("resize", requestMobileUpdate);
    };

    configure();
    desktop.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestDesktopUpdate);
      window.removeEventListener("resize", requestDesktopUpdate);
      window.removeEventListener("scroll", requestMobileUpdate);
      window.removeEventListener("resize", requestMobileUpdate);
      desktop.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
    };
  }, []);

  useEffect(
    () => () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      if (storyTimerRef.current) window.clearTimeout(storyTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (
      storySnapshot.workflow === displayedWorkflow &&
      storySnapshot.stage === activeStage
    ) {
      return;
    }

    if (storyTimerRef.current) window.clearTimeout(storyTimerRef.current);
    setLeavingStory(storySnapshot);
    const nextStory = {
      workflow: displayedWorkflow,
      stage: activeStage,
      id: storySnapshot.id + 1,
    };
    storySnapshotRef.current = nextStory;
    setStorySnapshot(nextStory);
    storyTimerRef.current = window.setTimeout(() => {
      setLeavingStory(null);
      storyTimerRef.current = null;
    }, 720);
  }, [activeStage, displayedWorkflow, storySnapshot]);

  const selectWorkflow = (workflow: WorkflowKey) => {
    if (workflow === selectedWorkflow) return;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);

    setSelectedWorkflow(workflow);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const nextStory = {
        workflow,
        stage: activeStageRef.current,
        id: storySnapshotRef.current.id + 1,
      };
      storySnapshotRef.current = nextStory;
      setLeavingStory(null);
      setStorySnapshot(nextStory);
      setDisplayedWorkflow(workflow);
      setCopyPhase("idle");
      return;
    }

    setCopyPhase("leaving");
    copyTimerRef.current = window.setTimeout(() => {
      const nextStory = {
        workflow,
        stage: activeStageRef.current,
        id: storySnapshotRef.current.id + 1,
      };
      storySnapshotRef.current = nextStory;
      setLeavingStory(null);
      setStorySnapshot(nextStory);
      setDisplayedWorkflow(workflow);
      setCopyPhase("entering");
      copyTimerRef.current = window.setTimeout(() => {
        setCopyPhase("idle");
        copyTimerRef.current = null;
      }, 820);
    }, 480);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: WorkflowKey =
      selectedWorkflow === "proposal" ? "scholar" : "proposal";
    selectWorkflow(next);
    document.getElementById(`workflow-tab-${next}`)?.focus();
  };

  const copy = workflowCopy[displayedWorkflow];

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="phase-two-workflow home-color-page home-color-page--cover"
      data-page-theme="light"
    >
      <div className="phase-two-workflow__inner" data-cover-content>
        <div
          ref={stickyRef}
          className="phase-two-workflow__sticky"
          data-workflow-stage={activeStage}
        >
          <div className="phase-two-workflow__frame">
            <header className="phase-two-workflow__heading">
          <h2>统一流程，贯穿完整交付</h2>
              <p>
                同一套工作方法进入不同专业场景：agent 持续参与执行，人始终保留关键判断。
              </p>
            </header>

            <div
              className="phase-two-workflow__tabs"
              role="tablist"
              aria-label="选择业务流程"
              onKeyDown={handleTabKeyDown}
            >
              {(Object.keys(workflowCopy) as WorkflowKey[]).map((workflow) => (
                <button
                  id={`workflow-tab-${workflow}`}
                  key={workflow}
                  type="button"
                  role="tab"
                  aria-selected={selectedWorkflow === workflow}
                  aria-controls="workflow-stage-copy"
                  tabIndex={selectedWorkflow === workflow ? 0 : -1}
                  onClick={() => selectWorkflow(workflow)}
                >
                  {workflowCopy[workflow].label}
                </button>
              ))}
            </div>

            <div
              id="workflow-stage-copy"
              className={`phase-two-workflow__track is-copy-${copyPhase}`}
              role="tabpanel"
              aria-labelledby={`workflow-tab-${displayedWorkflow}`}
              aria-busy={copyPhase !== "idle"}
            >
              <div className="phase-two-workflow__line" aria-hidden="true">
                <span className="phase-two-workflow__line-progress" />
                <span className="phase-two-workflow__line-beam" />
              </div>

              {stages.map(({ title, icon: Icon }, index) => {
                const isCurrent = index === activeStage;
                const isComplete = index < activeStage;
                const nodeClass = [
                  "phase-two-workflow__node",
                  index <= activeStage ? "is-active" : "",
                  isCurrent ? "is-current" : "",
                  isComplete ? "is-complete" : "",
                ].filter(Boolean).join(" ");

                return (
                  <article
                    key={title}
                    className={nodeClass}
                    data-workflow-node={index}
                    style={{ "--node-index": index } as CSSProperties}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className="phase-two-workflow__marker" aria-hidden="true">
                      {Icon ? <Icon size={25} weight="light" /> : <span />}
                    </div>
                    <h3>{title}</h3>
                    <p>{copy.stages[index].summary}</p>
                  </article>
                );
              })}
            </div>

            <div className={`phase-two-workflow__story-stack is-copy-${copyPhase}`} aria-live="polite">
              {leavingStory ? (
                <WorkflowStory
                  key={`leaving-${leavingStory.id}`}
                  workflow={leavingStory.workflow}
                  stage={leavingStory.stage}
                  transition="leaving"
                />
              ) : null}
              <WorkflowStory
                key={`current-${storySnapshot.id}`}
                workflow={storySnapshot.workflow}
                stage={storySnapshot.stage}
                transition="entering"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
