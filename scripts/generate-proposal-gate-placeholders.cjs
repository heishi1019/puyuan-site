const { chromium } = require("playwright");
const path = require("path");

const gates = [
  { id: "g1", code: "G1", title: "路线图确认", subtitle: "确认本期申报项目与优先级", type: "roadmap" },
  { id: "g2", code: "G2", title: "诊断与 Go / No-Go", subtitle: "基于门槛、周期、成本与可行性做决定", type: "decision" },
  { id: "g3", code: "G3", title: "关键事实与数据确认", subtitle: "技术与财务负责人共同核对关键口径", type: "facts" },
  { id: "g5", code: "G5", title: "一键修订授权", subtitle: "仅授权安全子集，保留原件与修改对照", type: "revision" },
  { id: "g4", code: "G4", title: "材料定稿确认", subtitle: "质检通过后由企业批准最终材料", type: "final" },
  { id: "g6", code: "G6", title: "退回修复方案确认", subtitle: "定位退回问题，确认方案后重新产出", type: "repair" },
];

const styles = `
  *{box-sizing:border-box}html,body{margin:0;width:1536px;height:1024px;overflow:hidden;background:#edf3fb;color:#10203a;font-family:Arial,"Microsoft YaHei",sans-serif}body{padding:52px}
  .app{height:100%;overflow:hidden;border:1px solid #b9cce4;border-radius:16px;background:#f8fbff;box-shadow:0 30px 80px rgba(44,78,130,.15)}header{display:flex;align-items:center;justify-content:space-between;height:88px;padding:0 34px;border-bottom:1px solid #d8e3f2;background:#fff}.brand{display:flex;align-items:center;gap:13px;font-weight:700;letter-spacing:.08em}.mark{width:32px;height:32px;border:2px solid #1d5bff;border-radius:50%;box-shadow:inset 0 0 0 8px #e8efff}.status{font:11px monospace;color:#1d5bff}
  .layout{display:grid;grid-template-columns:250px 1fr;height:calc(100% - 88px)}aside{padding:30px 22px;border-right:1px solid #d8e3f2;background:#f1f6fd}.project{padding:16px;border:1px solid #c7d5e7;border-radius:8px;background:#fff;font-size:13px;font-weight:700}.nav{margin-top:26px}.nav span{display:block;padding:13px 12px;border-bottom:1px solid #dce6f2;color:#6c8099;font-size:12px}.nav span.active{color:#1d5bff;background:#e9f0ff}
  main{position:relative;padding:34px 38px;background-image:linear-gradient(rgba(184,201,226,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(184,201,226,.18) 1px,transparent 1px);background-size:32px 32px}.topline{display:flex;justify-content:space-between;align-items:flex-start}.code{font:12px monospace;color:#1d5bff;letter-spacing:.1em}.topline h1{margin:10px 0 0;font-size:38px;letter-spacing:0}.topline p{margin:11px 0 0;color:#647892;font-size:15px}.badge{padding:8px 10px;border:1px solid #9db8ed;border-radius:4px;color:#1d5bff;background:#edf3ff;font:10px monospace}
  .workspace{position:absolute;inset:168px 38px 38px;display:grid;grid-template-columns:1.25fr .75fr;gap:18px}.panel{overflow:hidden;border:1px solid #c6d5e7;border-radius:10px;background:rgba(255,255,255,.95);box-shadow:0 20px 44px rgba(44,78,130,.1)}.panelTitle{padding:18px 20px;border-bottom:1px solid #dfe8f3;font-size:13px;font-weight:700}.content{padding:20px}.row{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;padding:17px 4px;border-bottom:1px solid #e3ebf4;color:#536b87;font-size:13px}.row b{color:#1d5bff;font:10px monospace}.pill{padding:6px 9px;border-radius:4px;background:#edf3ff;color:#1d5bff;font-size:10px}.pill.gray{background:#eef2f6;color:#70839b}.pill.green{background:#eaf8f3;color:#2d8067}.action{margin-top:22px;padding:13px 16px;border-radius:5px;background:#1d5bff;color:#fff;font-size:12px;text-align:center}.note{margin-top:14px;color:#73869e;font-size:11px;line-height:1.6}
  .metric{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.metric div{padding:18px 12px;border:1px solid #d8e3f2;border-radius:6px;background:#f6f9fd}.metric span{display:block;color:#70839b;font-size:10px}.metric b{display:block;margin-top:12px;color:#18304f;font-size:17px}.doc{height:100%;padding:36px;border:1px solid #d2deed;background:#fff;box-shadow:0 18px 34px rgba(44,78,130,.1)}.doc h2{font-size:23px;margin:0 0 24px}.line{height:8px;margin:14px 0;border-radius:4px;background:#dce6f2}.line.blue{width:78%;background:#b9cdf7}.line.short{width:58%}.check{display:flex;align-items:center;gap:9px;padding:14px 0;border-bottom:1px solid #e0e8f3;color:#526b87;font-size:12px}.check:before{content:"✓";display:grid;width:22px;height:22px;place-items:center;border-radius:50%;background:#1d5bff;color:#fff}.alert{padding:16px;border-left:3px solid #df8c8c;background:#fff3f3;color:#805b62;font-size:12px;line-height:1.6}.repair{margin-top:18px;padding:16px;border-left:3px solid #53b999;background:#effaf6;color:#376f61;font-size:12px;line-height:1.6}
`;

function leftContent(type) {
  if (type === "roadmap") return `<div class="row"><b>01</b><span>高企认定</span><i class="pill">本期优先</i></div><div class="row"><b>02</b><span>研发费加计</span><i class="pill gray">同步准备</i></div><div class="row"><b>03</b><span>专项资金</span><i class="pill gray">后续窗口</i></div>`;
  if (type === "decision") return `<div class="metric"><div><span>硬性门槛</span><b>逐项核验</b></div><div><span>补强周期</span><b>企业确认</b></div><div><span>投入产出</span><b>三档参考</b></div></div><div class="row"><b>A</b><span>建议申报</span><i class="pill green">可推进</i></div><div class="row"><b>B</b><span>暂缓申报</span><i class="pill gray">先补强</i></div><div class="row"><b>C</b><span>不建议申报</span><i class="pill gray">说明理由</i></div>`;
  if (type === "facts") return `<div class="row"><b>01</b><span>财务口径与收入划分</span><i class="pill">财务确认</i></div><div class="row"><b>02</b><span>研发费用归集</span><i class="pill">财务确认</i></div><div class="row"><b>03</b><span>关键技术事实</span><i class="pill">技术确认</i></div>`;
  if (type === "revision") return `<div class="alert">发现格式项、错别字与明确的单点替换建议。</div><div class="repair">勾选后仅修订安全子集；数据口径与语义改写不会自动执行。</div><div class="row"><b>01</b><span>保留原件</span><i class="pill green">已开启</i></div><div class="row"><b>02</b><span>修订前后对照</span><i class="pill green">可查看</i></div>`;
  if (type === "final") return `<div class="check">证据核查关键问题已处理</div><div class="check">格式与附件清单已检查</div><div class="check">最终版本等待企业批准</div><div class="action">确认材料定稿</div>`;
  return `<div class="alert">退回意见已解析，并定位到相关材料与问题位置。</div><div class="repair">系统给出修复方案；企业确认后重新生成修订稿。</div><div class="row"><b>01</b><span>退回意见</span><i class="pill">已定位</i></div><div class="row"><b>02</b><span>修复方案</span><i class="pill gray">待确认</i></div>`;
}

function rightContent(type) {
  if (type === "roadmap") return `<div class="panelTitle">本期路线图</div><div class="content"><div class="check">确认项目范围</div><div class="check">调整优先级</div><div class="check">指定负责人</div><div class="action">确认并进入诊断</div></div>`;
  if (type === "decision") return `<div class="panelTitle">Go / No-Go 决策卡</div><div class="content"><div class="doc"><h2>是否进入材料编制？</h2><div class="line blue"></div><div class="line"></div><div class="line short"></div><div class="action">企业确认决策</div></div></div>`;
  if (type === "facts") return `<div class="panelTitle">待确认事实清单</div><div class="content"><div class="check">来源可回到原始材料</div><div class="check">修改保留处理记录</div><div class="check">无据内容不写入正文</div><div class="action">提交确认结果</div></div>`;
  if (type === "revision") return `<div class="panelTitle">修订稿预览</div><div class="content"><div class="doc"><h2>修改前后对照</h2><div class="line"></div><div class="line blue"></div><div class="line"></div><div class="line short"></div><div class="note">复杂语义与数据口径继续交由人工确认。</div></div></div>`;
  if (type === "final") return `<div class="panelTitle">最终材料预览</div><div class="content"><div class="doc"><h2>项目申报材料</h2><div class="line blue"></div><div class="line"></div><div class="line"></div><div class="line short"></div><div class="note">G4 不可省略，最终责任与决定留给企业。</div></div></div>`;
  return `<div class="panelTitle">修复任务</div><div class="content"><div class="check">问题材料已定位</div><div class="check">修复步骤已拆分</div><div class="check">修订稿将保留版本记录</div><div class="action">确认修复方案</div></div>`;
}

function html(gate) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${styles}</style></head><body><div class="app"><header><div class="brand"><span class="mark"></span>PROPOSALPILOT AGENT</div><span class="status">CONCEPT PREVIEW / REPLACE LATER</span></header><div class="layout"><aside><div class="project">企业申报工作区</div><div class="nav"><span>项目路线图</span><span>资格诊断</span><span class="active">人工门控</span><span>材料与质检</span><span>版本记录</span></div></aside><main><div class="topline"><div><span class="code">${gate.code} / HUMAN GATE</span><h1>${gate.title}</h1><p>${gate.subtitle}</p></div><span class="badge">等待企业确认</span></div><div class="workspace"><section class="panel"><div class="panelTitle">系统整理结果</div><div class="content">${leftContent(gate.type)}<div class="note">概念效果图，不代表正式产品界面。</div></div></section><section class="panel">${rightContent(gate.type)}</section></div></main></div></div></body></html>`;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  for (const gate of gates) {
    await page.setContent(html(gate), { waitUntil: "load" });
    await page.screenshot({ path: path.join("public", "images", `proposal-gate-${gate.id}-placeholder.png`) });
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
