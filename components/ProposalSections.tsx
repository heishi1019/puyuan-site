import Image from "next/image";
import EvidenceGraph from "@/components/EvidenceGraph";
import SovereigntySwitch from "@/components/SovereigntySwitch";

const gates = [
  {
    number: "G1",
    phase: "路线图生成后",
    title: "先决定本期报什么",
    description: "系统可以整理机会，但本期选择哪些项目、先后顺序如何，必须由企业确认。未经确认，不进入后续申报任务。",
    points: ["确认目标项目与优先级", "明确本期申报范围", "指定经办人与确认角色"],
    owner: "企业负责人 / 经办人",
    output: "本期项目路线图",
    image: "/images/proposal-gate-g1-placeholder.png",
  },
  {
    number: "G2",
    phase: "诊断完成后",
    title: "不只判断能不能报，也判断值不值得报",
    description: "企业审阅硬性门槛、关键缺口、补强周期与成本，再结合 Go / No-Go 建议和投入产出三档，决定申报、暂缓或不报。",
    points: ["核验门槛与一票否决项", "评估补强周期、成本与可行性", "确认申报 / 暂缓 / 不报"],
    owner: "企业决策者",
    output: "Go / No-Go 决策卡",
    image: "/images/proposal-gate-g2-placeholder.png",
  },
  {
    number: "G3",
    phase: "材料编制前",
    title: "关键事实不让 AI 替企业作答",
    description: "财务口径、收入划分、研发费用归集和关键技术事实，需要财务与技术人员深度参与。缺少依据的内容标记待补充，不写入正文。",
    points: ["确认财务与研发费用口径", "核对收入划分和来源材料", "由技术人员确认关键技术事实"],
    owner: "财务负责人 / 技术负责人",
    output: "已确认关键事实清单",
    image: "/images/proposal-gate-g3-placeholder.png",
  },
  {
    number: "G4",
    phase: "质检通过后",
    title: "最终材料必须由企业批准",
    description: "证据核查关键问题处理完成后，企业审阅并批准最终材料。G4 不可省略，系统不能替企业承担最终申报决定。",
    points: ["审阅最终正文与附件清单", "确认版本、口径与签章准备", "批准进入提交准备阶段"],
    owner: "企业负责人 / 授权审批人",
    output: "企业确认的最终材料",
    image: "/images/proposal-gate-g4-placeholder.png",
  },
  {
    number: "G5",
    phase: "质检提出修订后",
    title: "只授权可确定修改的安全子集",
    description: "错别字、明确格式项和单点确定替换可以勾选授权；数据口径不一致和语义重写不会被自动改写，仍需人工确认。",
    points: ["逐项选择是否授权修订", "强制保留原件与修改对照", "修订稿可查看版本并回滚"],
    owner: "经办人 / 材料负责人",
    output: "修订版材料与修改对照",
    image: "/images/proposal-gate-g5-placeholder.png",
  },
  {
    number: "G6",
    phase: "收到退回意见后",
    title: "先确认修复方案，再重新产出",
    description: "企业上传或拍照提交退回意见，系统定位问题材料并给出修复方案。企业确认后再调度撰稿与质检流程重新生成修订稿。",
    points: ["解析并定位退回问题", "拆分需要修复的材料与步骤", "确认方案后生成修订稿"],
    owner: "经办人 / 授权审批人",
    output: "修复方案与修订稿",
    image: "/images/proposal-gate-g6-placeholder.png",
  },
];

export default function ProposalSections({ auditTypes }: { auditTypes: readonly string[] }) {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="site-section-title text-3xl font-semibold text-text">把分散材料，连成可核查的证据链</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">智小申跨文件追踪数字、主张与来源，让材料问题在定稿前暴露，而不是提交后才被发现。</p>
        </div>
        <EvidenceGraph auditTypes={auditTypes} />
      </section>

      <ProposalGateStack />

      <section className="mx-auto max-w-6xl px-6 py-section">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="site-section-title text-3xl font-semibold text-text">数据留在哪里，由企业决定</h2>
        </div>
        <SovereigntySwitch />
      </section>
    </>
  );
}

export function ProposalGateStack() {
  return (
      <section className="gate-stack-section proposal-gate-stack-mono home-color-page home-color-page--cover border-y border-border bg-surface/30 px-6 py-section" data-page-theme="light">
        <div className="mx-auto max-w-7xl">
          <div className="gate-stack-intro mx-auto max-w-4xl text-center" data-cover-content>
            <h2 className="site-section-title text-3xl font-semibold text-text">系统主驱，但关键决定留给人</h2>
            <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-muted">六道人工门控贯穿申报流程。系统负责整理事实、核验材料和提出下一步，企业在每张门控纸片上确认方向、数据、修订与最终版本。G4 材料定稿不可省略。</p>
          </div>
          <div className="gate-stack">
            {gates.map(({ number, phase, title, description, points, owner, output, image }) => (
              <article className={`gate-sheet ${number === "G4" ? "gate-sheet--key" : ""}`} key={number}>
                <div className="gate-sheet__copy">
                  <div className="gate-sheet__meta">
                    <span>{number}</span>
                    <span>{phase}</span>
                  </div>
                  <h3>{title}</h3>
                  <p className="gate-sheet__lead">{description}</p>
                  <ul>
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <dl>
                    <div><dt>确认角色</dt><dd>{owner}</dd></div>
                    <div><dt>阶段交付</dt><dd>{output}</dd></div>
                  </dl>
                </div>
                <figure className="gate-sheet__visual">
                  <Image src={image} alt={`${number} ${title}概念效果图`} width={1536} height={1024} sizes="(max-width: 900px) 100vw, 58vw" />
                  <figcaption>概念效果图 · 后续可替换为正式产品截图</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>
  );
}
