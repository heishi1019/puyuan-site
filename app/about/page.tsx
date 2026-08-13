import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const aboutOrgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "杭州溥源智能科技有限公司",
  alternateName: ["溥源科技", "PuYuan Tech"],
  url: "https://www.puyuan.tech/about",
  logo: "https://www.puyuan.tech/logo-full.svg",
  description:
    "溥源科技从真实工作场景出发，构建能理解任务、组织资料、推进流程并协助交付的专业 agent。",
};

export const metadata: Metadata = {
  title: "关于溥源科技",
  description:
    "杭州溥源智能科技有限公司（PuYuan Tech）从真实工作场景出发，构建能理解任务、组织资料、推进流程并协助交付的专业 agent。",
  alternates: { canonical: "/about" },
};

const workingMethod = [
  ["理解任务", "把目标、上下文与已有资料放进同一个可追溯的工作范围。"],
  ["组织依据", "将专业知识、规则、文件与证据关联起来，避免结果脱离来源。"],
  ["推进流程", "把复杂任务拆成连续步骤，在需要时调用合适的工具和协作方式。"],
  ["交付成果", "输出可以复核、继续编辑和继续使用的阶段性成果，而不止一段回答。"],
];

const workCharacteristics = [
  ["信息量大", "需要长期处理材料、规则和上下文，不能只依靠一次检索。"],
  ["流程复杂", "任务跨越多个步骤、角色和工具，需要持续推进而不是单点生成。"],
  ["责任明确", "结果需要事实依据、能力边界和人工确认，专业判断不能被省略。"],
];

export default function AboutPage() {
  return (
    <div className="about-story" data-no-text-reveal>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutOrgSchema) }} />

      <section className="about-story__hero">
        <div className="about-story__shell about-story__hero-grid">
          <div className="about-story__hero-copy">
            <img src="/brand-logo-mark.png" alt="溥源科技" className="about-story__mark" />
            <p className="about-story__kicker">杭州溥源智能科技有限公司</p>
            <h1>从知识源头，驱动专业 agent。</h1>
            <p>
              溥源科技是一家 AI-native 公司。我们从真实工作场景和用户痛点出发，构建能够理解任务、组织资料、推进流程并协助交付的专业 agent。
            </p>
          </div>
          <div className="about-story__hero-note">
            <p>我们关注的不是让 AI 多说一句话，而是让它在清晰边界内参与一项真实工作。</p>
            <dl>
              <div><dt>中文品牌</dt><dd>溥源科技</dd></div>
              <div><dt>英文品牌</dt><dd>PuYuan Tech</dd></div>
              <div><dt>当前切入</dt><dd>企业政府项目申报与科研工作</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="about-story__section about-story__definition">
        <div className="about-story__shell about-story__narrow">
          <p className="about-story__kicker">我们是谁</p>
          <h2>不是把通用聊天工具搬进专业场景。</h2>
          <p className="about-story__lead">
            专业工作往往信息分散、步骤漫长，并且需要依据与责任。溥源科技把大语言模型、专业知识、智能工作流和工具执行能力组织为产品，让 agent 能够围绕一个任务持续工作。
          </p>
          <p className="about-story__body">
            这意味着 agent 不只回答问题，还需要理解目标、分析资料、参与流程，并把中间结果交给人继续判断与使用。系统负责检索、整理、比对和初步编制，人负责审阅、取舍和最终决策。
          </p>
        </div>
      </section>

      <section className="about-story__section about-story__method">
        <div className="about-story__shell">
          <div className="about-story__heading about-story__heading--method">
            <p className="about-story__kicker">我们的工作方式</p>
            <h2>从资料与规则出发，把过程推向可用结果。</h2>
          </div>
          <ol className="about-story__steps">
            {workingMethod.map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-story__section about-story__work">
        <div className="about-story__shell">
          <p className="about-story__kicker">我们选择的场景</p>
          <h2>高门槛工作，需要的不只是一次生成。</h2>
          <div className="about-story__work-grid">
            {workCharacteristics.map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="about-story__body about-story__work-note">
            因此，我们优先进入高信息量、多步骤、高重复性且需要长期知识积累的工作，再根据真实反馈扩展新的专业方向。
          </p>
        </div>
      </section>

      <section className="about-story__section about-story__products">
        <div className="about-story__shell">
          <p className="about-story__kicker">正在推进的产品</p>
          <h2>同一套方法，进入不同的专业流程。</h2>
          <div className="about-story__product-list">
            <Link href="/proposalpilot" className="about-story__product-row">
              <div>
                <strong>智小申</strong>
                <span>ProposalPilot Agent</span>
              </div>
              <p>面向企业政府项目申报，围绕机会发现、资格诊断、材料编制、证据核查与申报跟进推进工作。</p>
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
            <Link href="/scholarpilot" className="about-story__product-row">
              <div>
                <strong>科小文</strong>
                <span>ScholarPilot Agent</span>
              </div>
              <p>面向科研工作，将文献、证据、文件与写作过程放进同一个研究项目中持续组织。</p>
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-story__section about-story__boundary">
        <div className="about-story__shell about-story__boundary-grid">
          <div>
            <p className="about-story__kicker">产品原则</p>
            <h2>专业可靠，来自明确的责任边界。</h2>
          </div>
          <div className="about-story__boundary-copy">
            <p>我们不把 agent 设计成替代专业判断的黑箱。每个产品都应当说明资料从哪里来、系统可以做什么、需要由谁确认，以及哪些结论不能被承诺。</p>
            <p>面对专业任务，可靠并不等于输出更长。可靠意味着结果有依据、过程可复核、关键决策仍由人掌握。</p>
          </div>
        </div>
      </section>

      <section className="about-story__closing">
        <div className="about-story__shell">
          <p className="about-story__kicker">持续扩展</p>
          <h2>让更多复杂工作，拥有合适的专业 agent。</h2>
          <p>溥源科技将继续从真实场景中寻找问题，围绕专业知识、流程协作和任务交付，扩展面向不同领域的 agent 产品家族。</p>
          <Link href="/#products">查看产品 <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
