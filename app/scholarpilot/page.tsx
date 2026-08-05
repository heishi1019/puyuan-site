import Button from "@/components/Button";
import { softwareAppSchema, faqSchema, SITE_URL } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "科小文 ScholarPilot",
  description:
    "科小文（ScholarPilot）是溥源科技面向科研人员的学术写作 agent，覆盖选题分析、文献综述、初稿撰写到润色投稿的全流程。",
};

const capabilities = [
  {
    title: "选题 & 文献综述",
    desc: "输入研究方向，自动检索相关文献并生成结构化综述，一份可直接引用的段落。",
  },
  {
    title: "初稿结构化撰写",
    desc: "按目标期刊风格组织章节框架，逐段生成初稿，全程逻辑可追溯。",
  },
  {
    title: "润色 & 投稿准备",
    desc: "针对语言规范、逻辑连贯性、摘要质量做多轮润色，并适配投稿格式要求。",
  },
];

const faqs = [
  {
    question: "科小文（ScholarPilot）是什么？",
    answer:
      "科小文是溥源科技（PuYuan Tech）开发的学术写作 agent，覆盖科研写作从选题到投稿的全流程：选题分析、文献综述生成、初稿撰写、润色与投稿格式适配。面向研究生、博士、青年教师及科研机构。",
  },
  {
    question: "科小文什么时候上线？",
    answer:
      "科小文目前正在内测阶段，计划近期公测。欢迎通过页面内按钮申请内测资格，我们会按序邀请。",
  },
];

export default function ScholarPilotPage() {
  const jsonLd = [
    softwareAppSchema(
      "科小文 ScholarPilot",
      "溥源科技面向科研人员的学术写作 agent，覆盖选题、文献综述、初稿撰写到润色投稿全流程。",
      `${SITE_URL}/scholarpilot`,
    ),
    faqSchema(faqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-6">
          <span className="inline-block rounded-pill border border-accent/30 bg-surface px-4 py-1.5 font-mono text-xs text-accent">
            即将上线 · 内测申请中
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text">
            科小文<br />
            <span className="text-accent font-mono text-2xl">ScholarPilot</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            从选题到投稿，全流程学术写作副驾驶。
            帮你把 30 篇文献读成一段可引用的综述，
            把研究思路转化成完整初稿。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="mailto:hello@puyuan.tech?subject=ScholarPilot内测申请" size="lg">
              申请内测资格
            </Button>
            <Button href="/" variant="secondary" size="lg">
              ← 返回首页
            </Button>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-border py-section px-6">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-2">
            <p className="font-mono text-xs text-muted uppercase tracking-widest">Capabilities</p>
            <h2 className="text-2xl font-semibold text-text">三大核心能力</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {capabilities.map((c, i) => (
              <div key={c.title} className="space-y-3 p-6 rounded-lg border border-border bg-surface">
                <span className="font-mono text-accent text-lg">0{i + 1}</span>
                <h3 className="font-semibold text-text">{c.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-section px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-2xl font-semibold text-center text-text">常见问题</h2>
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

      {/* CTA */}
      <section className="border-t border-border py-section px-6 text-center space-y-6">
        <p className="text-muted">第一时间获得内测资格</p>
        <Button href="mailto:hello@puyuan.tech?subject=ScholarPilot内测申请" size="lg">
          申请内测
        </Button>
      </section>
    </>
  );
}
