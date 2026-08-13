import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, FlowArrow, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/Button";
import FaqAccordion from "@/components/FaqAccordion";
import HomePageCoverMotion from "@/components/HomePageCoverMotion";
import ProductHero from "@/components/ProductHero";
import ProposalConceptFlow from "@/components/ProposalConceptFlow";
import { ProposalGateStack } from "@/components/ProposalSections";
import { faqSchema, softwareAppSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "智小申 ProposalPilot Agent · 企业项目申报共创",
  description: "智小申是 Pryos AI 面向中国企业项目申报场景研发的专业智能体，目前处于研发与共创阶段，尚无公开原型。",
  alternates: { canonical: "https://project.pryos.cn" },
};

const problems = [
  ["信息入口分散", "政策、项目、指南和截止时间来自不同渠道，团队很难持续维护同一份机会清单。"],
  ["条件与材料难对应", "申报条件、企业资质和证明材料分散在不同文件中，缺口经常到后期才暴露。"],
  ["过程难以复用", "每次申报都重新找资料、排任务和核对版本，项目结束后也没有形成可复用资产。"],
];

const principles = [
  ["官方信息优先", "政策、指南、截止时间和资格条件以官方发布渠道为准。"],
  ["无依据不补造", "财务、资质、人员、知识产权和经营数据必须来自企业真实资料。"],
  ["关键决定归企业", "资格、预算、承诺、盖章和最终提交由企业或专业服务人员确认。"],
  ["不承诺申报结果", "不预测或保证项目获批、资金金额和评审结果。"],
];

const faqs = [
  { question: "智小申现在可以公开使用吗？", answer: "暂时不可以。智小申处于研发与共创阶段，尚无公开原型。页面展示的是产品方向和计划验证的工作链，不是已经上线的功能清单。" },
  { question: "智小申当前聚焦哪些项目？", answer: "当前方向聚焦科技、工信、人才、补贴等政府类企业项目，具体支持范围需要在共创过程中逐步验证。" },
  { question: "智小申能确定企业符合申报条件吗？", answer: "不能替代最终判断。系统方向是协助拆解条件并整理依据，最终仍以官方文件、主管部门和专业人员意见为准。" },
  { question: "智小申会保证项目获批吗？", answer: "不会。智小申不预测或承诺项目获批、资金金额与评审结果，也不会把缺少依据的内容补造成事实。" },
  { question: "为什么现在招募共创用户？", answer: "共创用于理解真实任务、责任边界和失败原因，再定义可以验证的功能。参与共创不代表商业合作或自动获得最终产品资格。" },
];

export default function ProposalPilotPage() {
  const jsonLd = [
    softwareAppSchema("智小申 ProposalPilot Agent", "Pryos AI 面向中国企业项目申报场景研发的专业智能体，目前处于研发与共创阶段。", "https://project.pryos.cn"),
    faqSchema(faqs),
  ];

  return (
    <div className="proposal-page proposal-page--monochrome bg-[#f3f3ef] text-[#121416]">
      {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <HomePageCoverMotion />

      <ProductHero product="proposal" />

      <section className="home-color-page home-color-page--cover relative z-[2] bg-[#0b0b0b] px-5 py-28 text-[#f4f4f1] sm:px-8 lg:py-36" data-page-theme="dark">
        <div className="mx-auto max-w-[1180px]" data-cover-content>
          <div><h2 className="text-center text-4xl font-semibold leading-tight sm:text-5xl">申报难的不是写一份材料，<br />而是持续管理整个过程。</h2><p className="mx-auto mt-10 max-w-[780px] text-center text-lg leading-8 text-[#f4f4f1]">机会信息、申报条件与材料版本分散在不同位置，真正消耗团队的是持续核对、协作和复用。智小申先从这些可以被验证的问题开始。</p></div>
          <div className="mt-20 divide-y divide-[#30363c] border-y border-[#30363c]">{problems.map(([title, text]) => <article key={title} className="grid gap-5 py-9 sm:grid-cols-[300px_1fr] sm:items-center"><h3 className="text-2xl font-medium">{title}</h3><p className="max-w-[760px] text-base leading-8 text-[#f4f4f1]">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="home-color-page home-color-page--cover relative z-[3] border-y border-[#c9c9c3] bg-[#f3f3ef] py-28 text-[#121416] lg:py-36" data-page-theme="light">
        <div className="mx-auto mb-16 max-w-[1180px] px-5 sm:px-8" data-cover-content><h2 className="mx-auto max-w-[800px] text-center text-3xl font-semibold leading-tight sm:text-4xl">八个计划环节，等待真实流程验证。</h2><p className="mx-auto mt-5 max-w-[670px] text-center text-sm leading-7 text-[#696d68]">以下内容统一属于产品规划，不代表功能已经开放。工作链会自动横向流转，用来说明共创准备验证的任务关系。</p></div>
        <ProposalConceptFlow />
      </section>

      <ProposalGateStack />

      <section className="proposal-gate-followup home-color-page home-color-page--cover relative z-[6] bg-[#0b0b0b] px-5 py-28 text-[#f4f4f1] sm:px-8 lg:py-36" data-page-theme="dark">
        <div className="mx-auto max-w-[1180px]" data-cover-content>
          <div className="grid gap-14">
            <div className="mx-auto max-w-[760px] text-center">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">先把真实申报工作<br />理解清楚</h2>
              <p className="mx-auto mt-6 max-w-[560px] text-sm leading-7 text-[#939ba2]">共创不是体验未完成的产品，而是用真实项目流程校准智小申的任务、边界和协作方式。</p>
            </div>
            <div className="divide-y divide-[#30363c] border-y border-[#30363c]">
              <div className="flex gap-5 py-7"><UsersThree className="mt-1 shrink-0 text-[#d7ff00]" size={26} /><div><h3 className="text-lg font-medium">真实流程访谈</h3><p className="mt-3 text-sm leading-7 text-[#939ba2]">围绕机会发现、资格判断、材料组织和节点跟进，梳理实际工作如何推进、容易在哪中断。</p></div></div>
              <div className="flex gap-5 py-7"><FileText className="mt-1 shrink-0 text-[#d7ff00]" size={26} /><div><h3 className="text-lg font-medium">脱敏材料分析</h3><p className="mt-3 text-sm leading-7 text-[#939ba2]">使用脱敏后的材料类型、清单和工作方法，验证信息结构与核查关系，不要求提交敏感原始数据。</p></div></div>
              <div className="flex gap-5 py-7"><FlowArrow className="mt-1 shrink-0 text-[#d7ff00]" size={26} /><div><h3 className="text-lg font-medium">流程与原型评审</h3><p className="mt-3 text-sm leading-7 text-[#939ba2]">共同审阅任务流、信息结构和早期方案，确认哪些环节可由 agent 辅助，哪些必须保留人工判断。</p></div></div>
            </div>
          </div>
          <p className="mt-12 border-t border-[#30363c] pt-6 text-sm leading-7 text-[#777f86]">共创安排以场景匹配和双方可投入时间为准，不等同于正式产品交付或商业合作。</p>
        </div>
      </section>

      <section className="home-color-page home-color-page--cover relative z-[7] border-y border-[#c9c9c3] bg-[#f3f3ef] px-5 py-28 text-[#121416] sm:px-8 lg:py-36" data-page-theme="light">
        <div className="mx-auto max-w-[1180px]" data-cover-content><h2 className="mx-auto max-w-[760px] text-center text-3xl font-semibold leading-tight sm:text-4xl">产品仍在研发，能力边界先说清楚。</h2><div className="mt-16 grid gap-px bg-[#cfd0ca] md:grid-cols-2">{principles.map(([title, text]) => <article key={title} className="min-h-52 bg-[#f3f3ef] p-7"><h3 className="text-xl font-medium">{title}</h3><p className="mt-4 text-sm leading-7 text-[#656963]">{text}</p></article>)}</div></div>
      </section>

      <section className="proposal-faq home-color-page home-color-page--cover relative z-[8] bg-[#0b0b0b] px-5 py-28 text-[#f4f4f1] sm:px-8 lg:py-36" data-page-theme="dark"><div className="mx-auto max-w-[840px]" data-cover-content><h2 className="text-center text-3xl font-semibold sm:text-4xl">关于研发阶段与共创边界</h2><FaqAccordion items={faqs} tone="dark" /></div></section>

      <section id="early-access" className="proposal-early-access home-color-page home-color-page--cover relative z-[9] scroll-mt-24 border-t border-[#c9c9c3] bg-[#f3f3ef] px-5 py-28 text-center text-[#121416] sm:px-8 lg:py-36" data-page-theme="light"><div data-cover-content><CheckCircle className="proposal-early-access__icon mx-auto text-[#121416]" size={34} /><h2 className="mx-auto mt-8 max-w-[820px] text-4xl font-semibold leading-tight sm:text-5xl">把真实流程带进来，<br />一起定义智小申。</h2><p className="mx-auto mt-6 max-w-[620px] text-sm leading-7 text-[#686c67]">适合有真实企业项目申报经验，并愿意共同拆解任务、验证边界与反馈方案的团队。</p><div className="proposal-early-access__action mt-9"><Button href="mailto:hello@puyuan.tech?subject=ProposalPilot%20%E5%85%B1%E5%88%9B%E7%94%B3%E8%AF%B7" size="lg">申请内测</Button></div><Link href="https://pryos.cn" className="mt-8 inline-flex items-center gap-2 text-sm text-[#686c67] hover:text-[#121416]">返回 Pryos AI 主站 <ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
