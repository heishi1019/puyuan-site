"use client";

import { useState } from "react";

const descriptions = [
  "跨文件比对金额、比例与时间口径",
  "每个亮点都回到企业真实材料",
  "从事实到结论保持完整路径",
  "发现不同材料之间的矛盾",
  "识别缺少量化依据的表达",
  "核对检测来源与证明强度",
] as const;

export default function EvidenceGraph({ auditTypes }: { auditTypes: readonly string[] }) {
  const [active, setActive] = useState(0);
  const checks = auditTypes.map((title, index) => [String(index + 1).padStart(2, "0"), title, descriptions[index]] as const);
  const current = checks[active];

  return (
    <div className="evidence-graph">
      <div className="evidence-graph__visual" aria-hidden="true">
        <span className="evidence-graph__orbit evidence-graph__orbit--outer" />
        <span className="evidence-graph__orbit evidence-graph__orbit--inner" />
        <span className="evidence-graph__core">结论</span>
        <span className="evidence-graph__label evidence-graph__label--one">研发投入</span>
        <span className="evidence-graph__label evidence-graph__label--two">知识产权</span>
        <span className="evidence-graph__label evidence-graph__label--three">检测报告</span>
        <span className="evidence-graph__label evidence-graph__label--four">财务数据</span>
        <span className="evidence-graph__link evidence-graph__link--one" />
        <span className="evidence-graph__link evidence-graph__link--two" />
        <span className="evidence-graph__link evidence-graph__link--three" />
        <span className="evidence-graph__link evidence-graph__link--four" />
      </div>

      <div className="evidence-graph__checks" role="tablist" aria-label="证据核查维度">
        {checks.map(([number, title], index) => (
          <button
            className={`evidence-check ${index === active ? "is-active" : ""}`}
            key={number}
            onClick={() => setActive(index)}
            role="tab"
            aria-selected={index === active}
          >
            <span>{number}</span>
            <strong>{title}</strong>
          </button>
        ))}
        <div className="evidence-check__detail" role="tabpanel">
          <span className="font-mono text-xs text-accent">CHECK {current[0]}</span>
          <p>{current[2]}</p>
        </div>
      </div>
    </div>
  );
}
