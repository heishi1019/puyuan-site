import type { Metadata } from "next";
import HomeProductJump from "@/components/HomeProductJump";
import HomePageCoverMotion from "@/components/HomePageCoverMotion";
import HomeFaq, { HOME_FAQS } from "@/components/HomeFaq";
import HomeSourceNetwork from "@/components/HomeSourceNetwork";
import HomeWorkflow from "@/components/HomeWorkflow";
import ProductMatrix from "@/components/ProductMatrix";
import { ArrowUpRight, Compass, FlowArrow, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { faqSchema, orgSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "溥源智能 · Pryos AI",
  description: "溥源智能（Pryos AI）专注专业智能体产品研发与产品化，让智能体走进真实的专业世界。",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="home-blue home-phase-one">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema([...HOME_FAQS])) }} />
      <HomePageCoverMotion />

      <section className="phase-one-hero" data-page-theme="light">
        <div className="phase-one-hero__copy">
          <h1>
            让智能体，走进真实的{" "}
            <span className="phase-one-hero__agent" aria-label="专业世界">
              <span aria-hidden="true">专</span>
              <span aria-hidden="true">业</span>
              <span aria-hidden="true">世</span>
              <span aria-hidden="true">界</span>
            </span>
          </h1>
          <p>溥源智能专注专业智能体产品研发与产品化，从科研与企业项目申报切入，让 AI 在明确边界内参与真实工作。</p>
          <HomeProductJump />
        </div>
        <HomeSourceNetwork />
      </section>

      <section id="company" className="home-company-subject" aria-labelledby="home-company-title">
        <div className="home-company-subject__shell">
          <div className="home-company-subject__intro">
            <p className="home-company-subject__kicker">溥源科技是谁</p>
            <h2 id="home-company-title">一家把 AI agent 带进真实工作流程的公司。</h2>
          </div>
          <div className="home-company-subject__copy">
            <p>
              杭州溥源智能科技有限公司（PuYuan Tech）从真实工作场景和用户痛点出发，构建能够理解任务、组织资料、推进流程并协助交付的专业 agent。
            </p>
            <p>
              我们将大语言模型、专业知识、智能工作流和工具执行能力组织成产品，让 AI 不只回答问题，也能在清晰的责任边界内参与一项真实工作。
            </p>
          </div>
        </div>
        <div
          id="about"
          className="home-company-subject__capabilities phase-one-capabilities"
          data-page-theme="dark"
        >
          <div className="phase-one-capabilities__inner">
            <div className="phase-one-capabilities__heading">
              <h2>把专业知识组织成可推进的工作</h2>
              <p>围绕高信息量、多步骤、专业门槛高的任务，agent 连接资料、规则与协作关系，并把关键判断留给人。</p>
            </div>
            <div className="phase-one-capabilities__grid">
              <article>
                <Compass size={28} weight="light" aria-hidden="true" />
                <h3>理解专业工作</h3>
                <p>从真实工作场景和用户痛点出发，减少流程适配、反复沟通和重新整理信息的成本。</p>
              </article>
              <article>
                <FlowArrow size={28} weight="light" aria-hidden="true" />
                <h3>贯穿完整流程</h3>
                <p>把专业知识、智能工作流和工具执行组织起来，持续参与发现、判断、执行与交付。</p>
              </article>
              <article>
                <UsersThree size={28} weight="light" aria-hidden="true" />
                <h3>人保留关键决策</h3>
                <p>agent 负责检索、整理、比对和初步编制，人负责审核、定稿和最终决策。</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <HomeWorkflow />

      <ProductMatrix />

      <HomeFaq />

      <section className="phase-two-contact home-color-page home-color-page--cover" data-page-theme="dark">
        <div className="phase-two-contact__inner" data-cover-content>
          <h2>联系溥源智能，开始专业协作</h2>
          <p>告诉我们你正在推进的专业任务。</p>
          <a href="mailto:hello@puyuan.tech">
            hello@puyuan.tech <ArrowUpRight size={30} weight="light" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
