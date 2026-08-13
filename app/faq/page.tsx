import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "@phosphor-icons/react/dist/ssr";
import HomePageCoverMotion from "@/components/HomePageCoverMotion";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "常见问题",
  description: "了解溥源智能、科小文内测、智小申共创，以及产品能力、数据路径和责任边界。",
  alternates: { canonical: "/faq" },
};

const faqGroups = [
  {
    id: "company",
    label: "公司与方法",
    items: [
      { question: "溥源智能是做什么的？", answer: "溥源智能（Pryos AI），全称杭州溥源智能科技有限公司，专注专业智能体产品研发与产品化。公司从科研和企业项目申报切入，让智能体在明确责任边界内理解目标、参与流程并协助形成可继续使用的产物。" },
      { question: "什么是专业智能体？", answer: "专业智能体围绕特定工作流程构建，不只回答单个问题，还会结合资料、规则、专业能力和工具执行，把复杂任务组织成可以持续推进的步骤。专业判断、关键确认和最终责任仍由用户掌握。" },
      { question: "目前有哪些产品？", answer: "科小文 ScholarPilot Agent 是当前旗舰产品，处于免费内测阶段并已有可演示原型；智小申 ProposalPilot Agent 面向企业项目申报，目前处于研发与共创阶段。" },
      { question: "为什么不同能力要标注产品阶段？", answer: "因为内测可演示、持续建设和规划方向代表不同开放程度。溥源智能会明确区分这些状态，避免把未来能力写成当前已经可用的承诺。" },
    ],
  },
  {
    id: "scholarpilot",
    label: "科小文内测",
    items: [
      { question: "科小文目前开放到什么阶段？", answer: "科小文处于免费内测阶段并已有可演示原型。当前可演示选题、研究设计与文献综述，文献阅读、证据整理与引用，以及论文写作与修改。" },
      { question: "科小文会替代研究者或保证发表吗？", answer: "不会。研究真实性、学术判断、署名、投稿决定与最终成果责任始终由研究者承担；科小文也不承诺论文发表、项目立项或基金获批。" },
      { question: "科小文会默认上传完整科研资料吗？", answer: "不会默认上传完整科研项目。产品采用本地优先的工作方式；调用云端模型或外部工具时的数据路径，以实际版本提示和隐私说明为准。" },
      { question: "实验室和科研机构可以申请吗？", answer: "可以。实验室、课题组和科研机构可以联系团队沟通试用范围、成员协作与数据边界，实际开放能力以当前内测版本为准。" },
    ],
  },
  {
    id: "proposalpilot",
    label: "智小申共创",
    items: [
      { question: "智小申现在可以公开使用吗？", answer: "暂时不可以。智小申处于研发与共创阶段，尚无公开原型，官网展示的是产品方向和计划验证的工作链。" },
      { question: "智小申计划解决哪些问题？", answer: "当前计划围绕政策与项目发现、资格条件初步检查、指南解读、材料清单与任务规划、文本辅助、指标一致性检查、节点提醒和项目材料归档展开。" },
      { question: "智小申能保证项目获批或生成可直接提交的材料吗？", answer: "不能。政策、资格、预算、承诺、盖章和最终提交必须由企业或专业服务人员确认，也不预测或承诺项目获批、资金金额与评审结果。" },
      { question: "为什么招募共创用户？", answer: "共创用于先理解真实任务、责任边界和失败原因，再定义可以验证的功能。参与共创不代表商业合作，也不代表自动获得最终产品资格。" },
      { question: "如何申请内测或联系团队？", answer: "个人研究者可以通过科小文页面申请免费内测；企业、园区、项目服务人员和科研机构可以发送邮件至 hello@puyuan.tech 沟通共创或机构试用。" },
    ],
  },
];

const allFaqs = faqGroups.flatMap((group) => group.items);

export default function FaqPage() {
  return (
    <div className="home-phase-one faq-page faq-page--phase">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(allFaqs)) }} />
      <HomePageCoverMotion />

      <header className="faq-hero" data-page-theme="dark">
        <div className="company-shell">
          <p className="company-eyebrow site-hero-eyebrow">溥源智能常见问题</p>
          <h1 className="site-hero-title">常见问题，<br /><span className="text-accent-gradient">清楚回答。</span></h1>
          <p className="site-hero-lead">关于公司、产品阶段、数据路径与责任边界的直接说明。</p>
        </div>
      </header>

      <section className="faq-body home-color-page home-color-page--cover" data-page-theme="light">
        <div className="company-shell faq-layout" data-cover-content>
          <aside className="faq-index">
            <div>
              <p>问题索引</p>
              <nav aria-label="常见问题分类">
                {faqGroups.map((group, index) => <a key={group.id} href={`#${group.id}`}><span>0{index + 1}</span>{group.label}</a>)}
              </nav>
            </div>
            <div className="faq-index__contact">
              <p>没有找到答案？</p>
              <a href="mailto:hello@puyuan.tech">联系团队 <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </aside>

          <div className="faq-groups">
            {faqGroups.map((group, groupIndex) => (
              <section id={group.id} className="faq-group" key={group.id}>
                <div className="faq-group__heading"><span>0{groupIndex + 1}</span><h2 className="site-section-title">{group.label}</h2></div>
                <div className="faq-list">
                  {group.items.map(({ question, answer }, itemIndex) => (
                    <details key={question} open={groupIndex === 0 && itemIndex === 0}>
                      <summary><span>{question}</span><Plus size={20} aria-hidden="true" /></summary>
                      <div><p>{answer}</p></div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
            <section className="faq-closing">
              <p>进一步了解我们的产品方法与长期方向。</p>
              <Link href="/about">关于溥源智能 <ArrowRight size={17} aria-hidden="true" /></Link>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
