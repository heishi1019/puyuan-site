"use client";

import {
  Books,
  FileText,
  PaperPlaneTilt,
  type Icon,
} from "@phosphor-icons/react";

const capabilities: Array<{
  title: string;
  description: string;
  meta: string;
  highlights: string[];
  icon: Icon;
}> = [
  {
    title: "选题与文献综述",
    description: "从研究方向开始整理问题，形成可继续追问的文献脉络。",
    meta: "研究问题 / 文献脉络",
    highlights: ["整理研究方向", "建立文献脉络", "形成可追问问题"],
    icon: Books,
  },
  {
    title: "初稿生成",
    description: "按研究目标组织章节结构，把零散思路推进成可编辑的初稿。",
    meta: "章节结构 / 可编辑初稿",
    highlights: ["按研究目标组织", "搭建章节结构", "推进可编辑初稿"],
    icon: FileText,
  },
  {
    title: "润色与投稿准备",
    description: "围绕语言、逻辑和投稿格式做多轮检查，保留研究者自己的判断。",
    meta: "语言逻辑 / 投稿格式",
    highlights: ["语言与逻辑检查", "核对投稿格式", "保留研究者判断"],
    icon: PaperPlaneTilt,
  },
];

export default function ScholarCapabilityGrid() {
  return (
    <div className="scholar-capability-grid grid gap-5 md:grid-cols-3">
      {capabilities.map(({ title, description, meta, highlights, icon: CapabilityIcon }) => (
        <article
          key={title}
          tabIndex={0}
          className="group relative flex min-h-72 flex-col items-center overflow-hidden rounded-md border border-border bg-surface px-6 py-8 text-center outline-none transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:shadow-glow-lg focus-visible:-translate-y-1 focus-visible:border-accent focus-visible:bg-accent focus-visible:shadow-glow-lg"
        >
          <span className="grid h-14 w-14 place-items-center rounded-md border border-accent/20 bg-accent/5 text-accent transition-[background-color,border-color,color,transform] duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:border-bg/15 group-hover:bg-bg group-focus-visible:-rotate-3 group-focus-visible:scale-110 group-focus-visible:border-bg/15 group-focus-visible:bg-bg">
            <CapabilityIcon size={27} weight="regular" aria-hidden />
          </span>
          <h3 className="mt-6 text-xl font-semibold text-text transition-colors duration-300 group-hover:text-bg group-focus-visible:text-bg">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted transition-[opacity,transform] duration-200 group-hover:-translate-y-1 group-hover:opacity-0 group-focus-visible:-translate-y-1 group-focus-visible:opacity-0">{description}</p>
          <p className="mt-auto pt-7 font-mono text-[10px] tracking-wide text-muted transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0">{meta}</p>
          <div className="pointer-events-none absolute inset-x-5 bottom-7 grid translate-y-4 gap-2 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {highlights.map((highlight, index) => (
              <span
                key={highlight}
                className={[
                  "mx-auto block rounded-pill px-4 py-2 text-xs font-medium shadow-sm",
                  index === 1 ? "-rotate-2 bg-bg text-text" : "rotate-1 border border-bg/10 bg-text text-bg",
                ].join(" ")}
              >
                {highlight}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
