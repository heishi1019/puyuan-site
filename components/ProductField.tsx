type ProductFieldProps = {
  variant: "proposal" | "scholar";
};

const proposalSteps = ["发现机会", "诊断资格", "编制材料", "质检定稿", "申报陪伴"];
const scholarSteps = ["文献综述", "初稿生成", "润色投稿"];

export default function ProductField({ variant }: ProductFieldProps) {
  const isProposal = variant === "proposal";

  return (
    <div className={`product-field product-field--${variant}`} aria-hidden="true">
      <div className="product-field__header">
        <span>{isProposal ? "PROPOSAL PIPELINE" : "WRITING PIPELINE"}</span>
        <span className="product-field__live"><i /> LIVE</span>
      </div>

      {isProposal ? (
        <div className="proposal-visual">
          <div className="proposal-pipeline">
            {proposalSteps.map((step, index) => (
              <div className="proposal-step" key={step} style={{ animationDelay: `${180 + index * 160}ms` }}>
                <span className="proposal-step__number">0{index + 1}</span>
                <span className="proposal-step__dot" />
                <span className="proposal-step__label">{step}</span>
              </div>
            ))}
          </div>
          <div className="evidence-console">
            <div className="evidence-console__title">EVIDENCE CHECK</div>
            <div className="evidence-console__metric"><strong>200</strong><span>页材料跨文件追踪</span></div>
            <div className="evidence-console__row"><span>数值一致性</span><b>PASS</b></div>
            <div className="evidence-console__row"><span>证据链闭环</span><b>PASS</b></div>
            <div className="evidence-console__row"><span>G4 人工定稿</span><b>REQUIRED</b></div>
            <span className="evidence-console__scan" />
          </div>
        </div>
      ) : (
        <div className="scholar-visual">
          <div className="document-stack">
            <div className="document-sheet document-sheet--back" />
            <div className="document-sheet document-sheet--middle" />
            <div className="document-sheet document-sheet--front">
              <span className="document-sheet__eyebrow">RESEARCH DRAFT</span>
              <span className="document-sheet__title" />
              <span className="document-sheet__line document-sheet__line--long" />
              <span className="document-sheet__line" />
              <span className="document-sheet__line document-sheet__line--short" />
              <span className="document-sheet__citation">[01] [02] [03]</span>
              <span className="document-sheet__cursor" />
            </div>
          </div>
          <div className="writing-stages">
            {scholarSteps.map((step, index) => (
              <div className="writing-stage" key={step} style={{ animationDelay: `${240 + index * 220}ms` }}>
                <span>0{index + 1}</span>{step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="product-field__footer">
        <span>{isProposal ? "系统主驱 / 人工门控" : "研究者主导 / agent 协作"}</span>
        <span className="text-accent">{isProposal ? "证据可溯源" : "内测准备中"}</span>
      </div>
    </div>
  );
}
