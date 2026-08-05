import Button from "@/components/Button";
import Card from "@/components/Card";
import { orgSchema, faqSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "溥源科技 · PuYuan Tech",
  description:
    "面向科研机构与企业的 AI-native 公司，用 agent 覆盖专业写作与政府项目申报两类高频刚需。",
};

/* ── Product matrix data ── */
const products = [
  {
    name: "智小申",
    nameEn: "ProposalPilot",
    tag: "政府项目申报 Agent",
    desc: "自主完成「发现机会 → 诊断资格 → 编制材料 → 质检定稿 → 申报提醒」，让中小企业拥有大企业级政府事务能力。",
    capabilities: [
      "政策全量匹配 · 资格诊断 · ROI 前置",
      "证据核查引擎：跨 200 页材料核查一致性",
      "私有化部署 / 云端加密，数据不出内网",
    ],
    href: "/proposalpilot",
    ctaLabel: "了解智小申 →",
    badge: null,
  },
  {
    name: "科小文",
    nameEn: "ScholarPilot",
    tag: "学术写作 Agent",
    desc: "覆盖选题、文献综述、初稿撰写到润色投稿的全流程，让科研写作从繁琐变流畅。",
    capabilities: [
      "选题分析 · 文献综述自动生成",
      "初稿结构化撰写与多轮润色",
      "投稿格式适配 · 期刊风格指引",
    ],
    href: "/scholarpilot",
    ctaLabel: "了解科小文 →",
    badge: "即将上线",
  },
];

/* ── Why PuYuan pillars ── */
const pillars = [
  {
    icon: "◎",
    title: "懂专业场景",
    desc: "深度理解政府申报与学术写作的流程、规则与评审逻辑，不只是通用文本生成。",
  },
  {
    icon: "⟳",
    title: "全流程而非工具箱",
    desc: "从信息收集到最终交付，agent 贯穿全链路，人只需在关键节点决策。",
  },
  {
    icon: "◫",
    title: "数据安全可私有化",
    desc: "支持私有化部署，数据不出内网；云端版签约承诺不保存、不训练。",
  },
  {
    icon: "✓",
    title: "诚实的能力边界",
    desc: "明确告知 agent 能做什么、不能做什么，不承诺「包过」，给你真实可用的结果。",
  },
];

/* ── FAQ data ── */
const faqs = [
  {
    question: "溥源科技是做什么的？",
    answer:
      "溥源科技（PuYuan Tech）是一家面向科研机构与企业的 AI-native 公司，旗下两款 agent 产品：智小申（ProposalPilot）覆盖政府项目申报全流程，科小文（ScholarPilot）覆盖学术写作全流程。",
  },
  {
    question: "智小申和科小文是同一个产品吗？",
    answer:
      "不是。智小申（ProposalPilot）面向企业，帮助完成高企认定、研发费加计、专项资金等政府项目申报；科小文（ScholarPilot）面向科研人员，覆盖论文选题到投稿的全流程学术写作支持。两者共享溥源科技底层能力，但场景、受众和功能各自独立。",
  },
  {
    question: "溥源的 agent 支持私有化部署吗？",
    answer:
      "支持。智小申提供私有化部署方案，数据完全不出内网，适合对数据安全有高要求的机构和企业。云端版签约承诺不保存用户材料、不用于模型训练，并全程加密传输。",
  },
];

/* ──────────────────────────────────────────────────────────── */

export default function HomePage() {
  const jsonLd = [orgSchema, faqSchema(faqs)];

  return (
    <>
      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6">
        {/* Subtle radial glow behind content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-8">
          {/* Label */}
          <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            AI-native · 专业场景 agent
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.15] text-text">
            从知识的源头<br />
            <span className="text-accent">驱动专业写作与申报</span>
          </h1>

          {/* Sub */}
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            溥源科技用 agent 覆盖科研写作与政府项目申报两类高频刚需——
            全流程、可溯源、数据安全可私有化。
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="https://app.puyuan.tech" size="lg">
              免费试用
            </Button>
            <Button href="/proposalpilot" variant="secondary" size="lg">
              预约 Demo
            </Button>
          </div>
        </div>
      </section>

      {/* ── Product Matrix ── */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-section">
        <div className="mb-12 text-center space-y-2">
          <p className="font-mono text-xs text-muted uppercase tracking-widest">
            Product Matrix
          </p>
          <h2 className="text-3xl font-semibold text-text">两款 Agent，同源驱动</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <Card key={p.name} glowOnHover className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                {/* Name row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-text">
                      {p.name}
                    </h3>
                    <p className="font-mono text-sm text-accent">{p.nameEn}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="inline-block rounded-pill border border-border px-3 py-0.5 font-mono text-xs text-muted">
                      {p.tag}
                    </span>
                    {p.badge && (
                      <span className="inline-block rounded-pill bg-surface border border-accent/30 px-3 py-0.5 font-mono text-xs text-accent">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>

                {/* Capabilities */}
                <ul className="space-y-2">
                  {p.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-0.5 text-accent select-none">·</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href={p.href}
                className="self-start text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                {p.ctaLabel}
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Why PuYuan ── */}
      <section className="border-t border-border py-section px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-2">
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
              Why PuYuan
            </p>
            <h2 className="text-3xl font-semibold text-text">为什么选溥源</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="space-y-3">
                <span className="font-mono text-2xl text-accent">{p.icon}</span>
                <h3 className="font-semibold text-text">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border py-section px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <p className="font-mono text-xs text-muted uppercase tracking-widest">FAQ</p>
            <h2 className="text-2xl font-semibold text-text">常见问题</h2>
          </div>

          <dl className="space-y-6">
            {faqs.map(({ question, answer }) => (
              <div key={question} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <dt className="font-medium text-text mb-2">{question}</dt>
                <dd className="text-sm text-muted leading-relaxed">{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border py-section px-6 text-center space-y-6">
        <h2 className="text-2xl font-semibold text-text">
          准备好让 agent 接管繁琐流程了吗？
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="https://app.puyuan.tech" size="lg">
            免费开始使用
          </Button>
          <Button href="mailto:hello@puyuan.tech" variant="secondary" size="lg">
            联系我们
          </Button>
        </div>
      </section>
    </>
  );
}
