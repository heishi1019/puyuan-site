"use client";

import { useEffect, useState } from "react";

const stages = [
  ["01", "发现机会"],
  ["02", "诊断资格"],
  ["03", "编制材料"],
  ["04", "证据核查"],
  ["05", "定稿提交"],
] as const;

export default function ProposalConsole() {
  const [activeStage, setActiveStage] = useState(3);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStage((stage) => (stage + 1) % stages.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="proposal-console" aria-label="智小申实时申报控制台">
      <div className="proposal-console__topline">
        <span>申报流程演示</span>
        <span className="proposal-console__status">证据同步核验</span>
      </div>

      <div className="proposal-console__project">
        <div>
          <span className="proposal-console__eyebrow">CURRENT PROJECT</span>
          <strong>高新技术企业认定</strong>
        </div>
        <span className="proposal-console__run">示例场景</span>
      </div>

      <div className="proposal-console__stages" role="list" aria-label="申报流程阶段">
        {stages.map(([number, label], index) => (
          <div
            className={`proposal-console__stage ${index === activeStage ? "is-active" : ""} ${index < activeStage ? "is-done" : ""}`}
            key={number}
            role="listitem"
          >
            <span className="proposal-console__stage-number">{number}</span>
            <span className="proposal-console__stage-dot" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="proposal-console__body">
        <div className="proposal-console__graph" aria-hidden="true">
          <span className="proposal-console__graph-ring proposal-console__graph-ring--one" />
          <span className="proposal-console__graph-ring proposal-console__graph-ring--two" />
          <span className="proposal-console__graph-core">证据</span>
          <span className="proposal-console__graph-node proposal-console__graph-node--one" />
          <span className="proposal-console__graph-node proposal-console__graph-node--two" />
          <span className="proposal-console__graph-node proposal-console__graph-node--three" />
          <span className="proposal-console__graph-trace proposal-console__graph-trace--one" />
          <span className="proposal-console__graph-trace proposal-console__graph-trace--two" />
          <span className="proposal-console__graph-trace proposal-console__graph-trace--three" />
        </div>

        <div className="proposal-console__metrics">
          <span className="proposal-console__eyebrow">EVIDENCE STATUS</span>
          <div className="proposal-console__metric"><strong>200+</strong><span>页材料正在追踪</span></div>
          <div className="proposal-console__metric"><strong>14</strong><span>项核查进行中</span></div>
          <div className="proposal-console__metric"><strong>G4</strong><span>定稿需人工确认</span></div>
        </div>
      </div>

      <div className="proposal-console__scan" aria-hidden="true" />
      <div className="proposal-console__footer">
        <span>系统主驱 / 人做决策</span>
        <span>G4 定稿人工确认</span>
      </div>
    </div>
  );
}
