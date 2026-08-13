import type { Metadata } from "next";
import ProductHero from "@/components/ProductHero";
import ScholarJourney from "@/components/ScholarJourney";
import ScholarEarlyAccess from "@/components/ScholarEarlyAccess";
import FaqAccordion from "@/components/FaqAccordion";
import ScholarPageCoverMotion from "@/components/ScholarPageCoverMotion";
import ScholarUseCaseCards from "@/components/ScholarUseCaseCards";
import { faqSchema, softwareAppSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "科小文 ScholarPilot Agent · AI 科研工作台",
  description: "科小文（ScholarPilot Agent）是 Pryos AI 面向中国科研人员打造的 AI 科研工作台，目前处于免费内测阶段并已有可演示原型。",
  alternates: { canonical: "https://scholar.pryos.cn" },
};

const demonstrableCapabilities = [
  { number: "01", title: "选题、研究设计与文献综述", text: "围绕研究方向整理问题边界、研究路径与文献脉络，形成可以继续检查和修改的研究框架。" },
  { number: "02", title: "文献阅读、证据整理与引用", text: "围绕研究问题组织检索策略、阅读记录、证据摘录与引用关系，保留回到来源核对的路径。" },
  { number: "03", title: "论文写作与修改", text: "根据研究者确认的材料组织章节与草稿，支持持续修改；观点、事实与最终结论仍由研究者负责。" },
];

const buildingCapabilities = ["投稿、返修与审稿回复", "中文数据库检索策略", "国内科研流程适配", "本地优先工作方式"];
const plannedCapabilities = ["数据分析与可复现代码", "科研项目与基金申请", "临床研究及专业学科任务", "200 余项科研技能体系", "自带 API"];

const faqs = [
  { question: "科小文 ScholarPilot Agent 是什么？", answer: "科小文是 Pryos AI 面向中国科研人员打造的 AI 科研工作台。它以科研项目为单位组织文献、文件、证据、写作过程与任务记录，目前处于免费内测阶段并已有可演示原型。" },
  { question: "现在可以直接下载使用吗？", answer: "目前采用内测申请与审核机制。个人研究者可以申请免费内测，实验室、课题组和科研机构可以联系团队沟通试用与合作。" },
  { question: "科小文会替代研究者写论文或保证发表吗？", answer: "不会。科小文协助处理信息、组织流程和形成可修改草稿；研究真实性、学术判断、署名、投稿决定与最终成果责任始终由研究者承担，也不承诺论文发表或项目获批。" },
  { question: "文献来源和引用可以核对吗？", answer: "内测方向是保留文献来源、证据摘录、引用位置和研究笔记之间的关联，让内容能够回到来源核对。引用准确性仍需研究者在最终稿中确认。" },
  { question: "数据会默认上传到云端吗？", answer: "产品采用本地优先的工作方式，不默认上传完整科研项目。调用云端模型或外部工具时的数据路径，以实际版本提示和隐私说明为准。" },
  { question: "目前哪些能力已经可以演示？", answer: "当前可演示选题、研究设计与文献综述，文献阅读、证据整理与引用，以及论文写作与修改。投稿返修、中文数据库策略等能力仍在持续建设，数据分析、基金申请等属于规划方向。" },
];

export default function ScholarPilotPage() {
  const jsonLd = [softwareAppSchema("科小文 ScholarPilot Agent", "Pryos AI 面向中国科研人员打造的 AI 科研工作台，目前处于免费内测阶段。", "https://scholar.pryos.cn"), faqSchema(faqs)];
  return <div className="scholar-page scholar-rebase">
    {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <ScholarPageCoverMotion />

    <ProductHero product="scholar" />

    <div className="scholar-cover scholar-cover--ink" data-scholar-theme="dark"><ScholarJourney /></div>

    <section id="capabilities" className="scholar-cover scholar-capabilities scroll-mt-24" data-scholar-theme="light">
      <div className="scholar-section-shell" data-scholar-cover-content>
        <header className="scholar-section-heading"><h2>把研究过程<br />留在同一个项目里</h2><span>从研究问题到论文修改，已可演示的能力围绕真实项目持续组织资料、证据与写作过程。</span></header>
        <div className="scholar-capability-grid">{demonstrableCapabilities.map(({ number, title, text }) => <article key={number}><small>内测可演示</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section id="roadmap" className="scholar-cover scholar-roadmap scroll-mt-24" data-scholar-theme="dark">
      <div className="scholar-section-shell" data-scholar-cover-content>
        <header className="scholar-section-heading"><h2>完整的科研工作，分阶段走近</h2><span>产品会持续扩展，但每一项能力都以当前真实开放范围为准，不把规划写成承诺。</span></header>
        <div className="scholar-roadmap-grid"><article><div><span className="scholar-roadmap__status">持续建设</span><h3>正在连接更长的研究链</h3><span>实际范围随内测版本说明</span></div><ul>{buildingCapabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></article><article><div><span className="scholar-roadmap__status">规划方向</span><h3>面向未来的专业任务</h3><span>不构成当前功能承诺</span></div><ul>{plannedCapabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></article></div>
        <ScholarUseCaseCards />
      </div>
    </section>

    <section className="scholar-cover scholar-faq" data-scholar-theme="light"><div className="scholar-section-shell" data-scholar-cover-content><header className="scholar-section-heading"><h2>科小文常见问题</h2></header><FaqAccordion items={faqs} /></div></section>
    <div className="scholar-cover scholar-cover--closing" data-scholar-theme="dark"><ScholarEarlyAccess /></div>
  </div>;
}
