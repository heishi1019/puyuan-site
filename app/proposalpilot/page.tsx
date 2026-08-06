import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { faqSchema, softwareAppSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "智小申 ProposalPilot Agent | 企业政府项目申报",
  description:
    "智小申（ProposalPilot Agent）是面向企业政府项目申报的 Agent-native 协作平台，覆盖机会发现、资格诊断、材料编制、证据核查、申报提醒与立项陪伴。",
  alternates: { canonical: "/proposalpilot" },
};

const workflow = [
  ["01", "发现机会", "按企业画像持续匹配可申报项目，梳理申报窗口与优先级。"],
  ["02", "诊断资格", "把条件拆到可核验项，识别满足项、差距项与补强路径。"],
  ["03", "编制材料", "基于企业真实资料组织申报内容；缺少依据的内容不填充。"],
  ["04", "质检定稿", "检查材料完整性、前后口径与证据链，并在定稿前保留人工确认。"],
  ["05", "申报与陪伴", "跟进关键时间点，覆盖申报提醒与立项后的后续事项。"],
] as const;

/* 6 大类核查维度 — 逐项对应 _prd_zhishen.md §4.3 F-MAT-04，勿改写为近义词 */
const auditTypes = [
  "数值一致性",
  "证据-主张映射",
  "证据链闭环",
  "跨维度逻辑一致性",
  "量化表述密度",
  "检测机构可信度",
];

const faqs = [
  {
    question: "智小申适用于哪些申报场景？",
    answer:
      "智小申面向企业政府项目申报，可用于高新技术企业认定、研发费用加计扣除、专项资金等场景。产品覆盖科技、发改、工信、人才、市场监管、商务六大主管部门，以及国家级、省部级、地市级三个层级的项目体系。",
  },
  {
    question: "智小申能否保证项目获批？",
    answer:
      "不能。对于高企认定、研发费用加计等硬门槛类项目，智小申会给出强判断；竞争性评审类项目只能通过材料质量、证据完整度和流程管理提升竞争力，不承诺获批或“包过”。",
  },
  {
    question: "企业材料上传到智小申后，数据如何处理？",
    answer:
      "可选择私有化部署或云端方案。私有化部署中，数据不出企业内网；云端方案按约定不保存用户材料、不用于模型训练，并采用加密传输。对数据边界要求更高的企业，建议采用私有化方案。",
  },
  {
    question: "系统会不会生成没有依据的申报内容？",
    answer:
      "不会把无据内容写入正式材料。智小申要求每个亮点和结论映射企业真实证据；缺少依据或存在夸大风险的内容会标红，并保留逐句溯源。材料定稿仍须由企业在人工门控中确认。",
  },
];

const applicationSchema = softwareAppSchema(
  "智小申 ProposalPilot Agent",
  "智小申（ProposalPilot Agent）是面向企业政府项目申报的 Agent-native 协作平台，自主完成机会发现、资格诊断、材料编制、质检定稿、申报提醒与立项陪伴。",
  "https://www.puyuan.tech/proposalpilot",
);

export default function ProposalPilotPage() {
  return (
    <>
      {[applicationSchema, faqSchema(faqs)].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative overflow-hidden border-b border-border px-6 py-24 sm:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" />
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow-lg" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">Government Project Application Agent</p>
          <div className="mb-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
            <h1 className="text-4xl font-semibold text-text sm:text-5xl">智小申</h1>
            <span className="font-mono text-lg text-muted">ProposalPilot Agent</span>
          </div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-text sm:text-2xl">
            Agent-native 企业政府项目申报协作平台。
          </p>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
            从发现机会到立项陪伴，系统主驱全流程；企业在关键节点做决定，让中小企业也能拥有大企业级政府事务能力。
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="https://app.puyuan.tech" external size="lg">免费试用</Button>
            <Button href="mailto:hello@puyuan.tech?subject=智小申%20Demo" variant="secondary" size="lg">预约 Demo</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-section">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">The Problem</p>
          <h2 className="mt-3 text-3xl font-semibold text-text">申报难，不止在写材料</h2>
          <p className="mt-4 leading-relaxed text-muted">政策信息分散、资格条件难拆解、企业资料跨部门且口径不一。缺少专职申报人的团队，往往在真正开始前就耗掉大量时间。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["机会不清", "不知道哪些项目适合自己，申报窗口和优先级也难以持续跟踪。"],
            ["资格难判", "条件散落在政策条款与企业材料中，差距项没有明确的补强路径。"],
            ["材料打架", "跨部门资料中的数字、时间与主体信息不一致，证据链容易断裂。"],
          ].map(([title, description], index) => (
            <Card key={title} className="min-h-48">
              <span className="font-mono text-sm text-accent">0{index + 1}</span>
              <h3 className="mt-8 text-xl font-semibold text-text">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/30 px-6 py-section">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold text-text">一个申报周期，五步推进</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">不是单次文本生成，而是一条从机会判断到材料交付的连续工作流。</p>
          </div>
          <ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-5">
            {workflow.map(([number, title, description]) => (
              <li key={number} className="min-h-56 bg-bg p-5">
                <span className="font-mono text-xs text-accent">{number}</span>
                <h3 className="mt-10 text-lg font-semibold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-section">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Evidence Audit Engine</p>
            <h2 className="mt-3 text-3xl font-semibold text-text">不替你判断“先进”，先替你核查证据</h2>
            <p className="mt-5 leading-relaxed text-muted">
              智小申的证据核查引擎面向跨文件的一致性、完整性与可信度。它能在超过 200 页的材料中，核查 6 大类、14 项证据问题，找出前后矛盾的数字与断裂的证据链。
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              这不是对技术先进性的主观裁决，而是为每项申报主张建立可复查的事实基础。通用大模型擅长生成，却难以持续追踪多份材料之间的同一口径。
            </p>
          </div>
          <div className="border border-accent/30 bg-surface p-6 shadow-glow">
            <div className="flex items-end justify-between border-b border-border pb-5">
              <div>
                <p className="font-mono text-xs text-muted">CROSS-DOCUMENT AUDIT</p>
                <p className="mt-2 text-3xl font-semibold text-accent">6 类 / 14 项</p>
              </div>
              <span className="font-mono text-xs text-muted">200+ PAGES</span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {auditTypes.map((type) => (
                <div key={type} className="border border-border px-3 py-2 font-mono text-xs text-muted">
                  <span className="mr-2 text-accent">+</span>{type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border px-6 py-section">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Trust Boundaries</p>
            <h2 className="mt-3 text-3xl font-semibold text-text">把能做与不能做，说清楚</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-l-2 border-accent pl-5">
              <h3 className="font-semibold text-text">硬门槛，给强判断</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">针对高企认定、研发费用加计等条件明确的项目，按可核验条件给出资格判断与差距项。</p>
            </div>
            <div className="border-l-2 border-border pl-5">
              <h3 className="font-semibold text-text">竞争评审，不承诺结果</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">竞争性项目可以提升材料质量和竞争力，但评审结果受多重因素影响，不做“包过”承诺。</p>
            </div>
            <div className="border-l-2 border-border pl-5">
              <h3 className="font-semibold text-text">无证据，不写入</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">每个亮点与结论须映射真实证据。无据或夸大的内容会标红，不进入正式申报材料。</p>
            </div>
          </div>
          <div className="mt-10 border border-border bg-surface px-5 py-4 text-sm leading-relaxed text-muted">
            <span className="mr-3 font-mono text-xs text-accent">G1-G6</span>
            系统主驱，人做决策。流程设置 6 道人工门控，材料定稿（G4）不可省略。
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-section">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Data Sovereignty</p>
          <h2 className="mt-3 text-3xl font-semibold text-text">数据留在哪里，由企业决定</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className="font-mono text-xs text-accent">PRIVATE DEPLOYMENT</p>
            <h3 className="mt-4 text-2xl font-semibold text-text">私有化部署</h3>
            <p className="mt-4 leading-relaxed text-muted">接入企业环境，数据不出企业内网。适用于材料敏感、数据边界严格或有本地部署要求的组织。</p>
          </Card>
          <Card>
            <p className="font-mono text-xs text-accent">CLOUD SERVICE</p>
            <h3 className="mt-4 text-2xl font-semibold text-text">云端协作</h3>
            <p className="mt-4 leading-relaxed text-muted">按签约约定不保存用户材料、不用于模型训练，并通过加密传输保护资料。需要更高控制权时，可选择私有化方案。</p>
          </Card>
        </div>
      </section>

      <section className="border-y border-border bg-surface/30 px-6 py-section">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Who It Serves</p>
            <h2 className="mt-3 text-3xl font-semibold text-text">按你的申报组织方式工作</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-xl font-semibold text-text">中小企业与兼职申报人</h3>
              <p className="mt-3 leading-relaxed text-muted">为没有专职申报团队的企业，把机会筛选、资格诊断、材料准备和时间节点放进同一条清晰流程。</p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-text">大企业与第三方代理</h3>
              <p className="mt-3 leading-relaxed text-muted">为政府事务专员与代理团队处理多主体、多项目、多材料的协作，保留证据、审校与决策留痕。</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-section">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-text">企业常问的问题</h2>
        </div>
        <dl className="mt-10 divide-y divide-border">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="py-6 first:pt-0">
              <dt className="font-semibold text-text">{question}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border px-6 py-section text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Start With Evidence</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold text-text">把申报工作放回可核查、可协作的轨道</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="https://app.puyuan.tech" external size="lg">免费试用</Button>
          <Button href="/" variant="secondary" size="lg">返回溥源科技首页</Button>
        </div>
        <Link href="/" className="mt-6 inline-block text-sm text-muted transition-colors hover:text-accent">PuYuan Tech / 从知识源头，驱动专业 agent</Link>
      </section>
    </>
  );
}
