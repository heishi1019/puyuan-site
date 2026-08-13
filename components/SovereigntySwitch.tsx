"use client";

import { useState } from "react";

const modes = {
  private: {
    label: "私有化部署",
    eyebrow: "PRIVATE DEPLOYMENT",
    title: "数据留在企业内网",
    text: "接入企业环境，适合材料敏感、边界要求严格或需要本地部署的组织。",
    flow: ["企业内网", "本地处理", "内部存储"],
  },
  cloud: {
    label: "云端协作",
    eyebrow: "CLOUD SERVICE",
    title: "按约定处理每份材料",
    text: "云端方案采用加密传输，按约定不保存用户材料、不用于模型训练。",
    flow: ["加密上传", "协作处理", "按约定不保存"],
  },
} as const;

export default function SovereigntySwitch() {
  const [mode, setMode] = useState<keyof typeof modes>("private");
  const active = modes[mode];

  return (
    <div className="sovereignty-switch">
      <div className="sovereignty-switch__tabs" role="tablist" aria-label="数据部署方式">
        {(Object.keys(modes) as Array<keyof typeof modes>).map((key) => (
          <button
            key={key}
            className={mode === key ? "is-active" : ""}
            onClick={() => setMode(key)}
            role="tab"
            aria-selected={mode === key}
          >
            {modes[key].label}
          </button>
        ))}
      </div>
      <div className="sovereignty-switch__content">
        <div>
          <span className="font-mono text-xs text-accent">{active.eyebrow}</span>
          <h3>{active.title}</h3>
          <p>{active.text}</p>
        </div>
        <div className="sovereignty-switch__flow" aria-label={active.label}>
          {active.flow.map((step, index) => (
            <div className="sovereignty-switch__flow-step" key={step}>
              <span>{step}</span>
              {index < active.flow.length - 1 && <i aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
