import FaqAccordion from "@/components/FaqAccordion";

export const HOME_FAQS = [
  {
    question: "溥源智能是谁？",
    answer: "溥源智能（Pryos AI），全称杭州溥源智能科技有限公司，专注专业智能体产品研发与产品化，让智能体在明确责任边界内进入真实工作流程。",
  },
  {
    question: "溥源智能的 agent 如何工作？",
    answer: "我们把模型、专业能力、工作流和工具执行组织在一起，协助用户处理信息、推进步骤并形成可继续使用的产物；专业判断、关键确认与最终责任仍由用户掌握。",
  },
  {
    question: "目前有哪些产品？",
    answer: "科小文 ScholarPilot Agent 是当前旗舰产品，处于免费内测阶段并已有可演示原型；智小申 ProposalPilot Agent 面向企业项目申报，目前处于研发与共创阶段。",
  },
  {
    question: "专业 agent 和通用聊天工具有什么不同？",
    answer: "专业 agent 不只回答单个问题，而是围绕具体任务保留上下文、连接知识与工具，并持续推进多步骤流程。溥源同时强调证据可追溯、人工决策和数据边界。",
  },
] as const;

export default function HomeFaq() {
  return (
    <section id="faq" className="phase-two-faq home-color-page home-color-page--cover" data-page-theme="light">
      <div className="phase-two-faq__inner" data-cover-content>
        <header>
          <h2>常见问题，理解溥源智能</h2>
          <p>从公司定位、工作方式到产品方向，集中回答最常见的问题。</p>
        </header>
        <FaqAccordion items={HOME_FAQS} />
      </div>
    </section>
  );
}
