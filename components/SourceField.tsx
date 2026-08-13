"use client";

import type { PointerEvent } from "react";

const inputs = ["政策与规则", "企业证据", "专业知识"];

const agents = [
  {
    name: "智小申",
    nameEn: "ProposalPilot Agent",
    className: "source-agent source-agent--proposal",
    status: "申报协作",
  },
  {
    name: "科小文",
    nameEn: "ScholarPilot Agent",
    className: "source-agent source-agent--scholar",
    status: "写作协作",
  },
  {
    name: "持续扩展",
    nameEn: "NEXT PROFESSIONAL AGENT",
    className: "source-agent source-agent--next",
    status: "场景接入",
  },
];

export default function SourceField() {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    const field = event.currentTarget;
    const rect = field.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const coreX = rect.width * 0.48;
    const coreY = rect.height * 0.49;
    const distance = Math.hypot(pointerX - coreX, pointerY - coreY);
    const influenceRadius = Math.min(rect.width, rect.height) * 0.58;
    const proximity = Math.max(0, Math.min(1, 1 - distance / influenceRadius));
    const attraction = 0.12 + proximity * 0.34;
    const lightX = pointerX + (coreX - pointerX) * attraction;
    const lightY = pointerY + (coreY - pointerY) * attraction;

    field.style.setProperty("--attractor-x", `${lightX}px`);
    field.style.setProperty("--attractor-y", `${lightY}px`);
    field.style.setProperty("--attractor-opacity", `${0.22 + proximity * 0.78}`);
    field.style.setProperty("--attractor-scale", `${0.72 + proximity * 0.78}`);
    field.style.setProperty("--source-glow-alpha", `${0.18 + proximity * 0.34}`);
    field.style.setProperty("--source-glow-soft-alpha", `${0.06 + proximity * 0.13}`);
    field.style.setProperty("--source-core-scale", `${1 + proximity * 0.055}`);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    const field = event.currentTarget;
    field.style.setProperty("--attractor-opacity", "0");
    field.style.setProperty("--source-glow-alpha", "0.18");
    field.style.setProperty("--source-glow-soft-alpha", "0.06");
    field.style.setProperty("--source-core-scale", "1");
  };

  return (
    <div
      className="source-field"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="source-field__grid" />
      <span className="source-attractor" />

      <div className="source-field__header">
        <span>PUYUAN / SOURCE SYSTEM</span>
        <span className="source-field__live"><i /> AGENT FAMILY ONLINE</span>
      </div>

      <div className="source-inputs">
        <span className="source-inputs__label">KNOWLEDGE INPUT</span>
        {inputs.map((input, index) => (
          <span key={input} className="source-input" style={{ animationDelay: `${index * 160}ms` }}>
            <i /> {input}
          </span>
        ))}
      </div>

      <div className="source-ring source-ring--outer" />
      <div className="source-ring source-ring--middle" />
      <div className="source-ring source-ring--inner" />

      <span className="source-beam source-beam--one" />
      <span className="source-beam source-beam--two" />
      <span className="source-beam source-beam--three" />

      <div className="source-core">
        <span className="source-core__pulse" />
        <span className="source-core__label">源</span>
        <span className="source-core__caption">PUYUAN</span>
      </div>

      {agents.map((agent, index) => (
        <div key={agent.nameEn} className={agent.className} style={{ animationDelay: `${index * 220}ms` }}>
          <span className="source-agent__index">0{index + 1}</span>
          <span className="source-agent__copy">
            <strong>{agent.name}</strong>
            <small>{agent.nameEn}</small>
          </span>
          <span className="source-agent__status"><i /> {agent.status}</span>
        </div>
      ))}

      <div className="source-field__footer">
        <span>一源驱动专业场景</span>
        <span className="source-field__trace">可执行 <i /> 可核查 <i /> 可协作</span>
      </div>
    </div>
  );
}
