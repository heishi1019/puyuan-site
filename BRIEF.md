# BRIEF — 溥源科技品牌视觉（喂给 open-design 的指令）

> 用法：在 open-design 里选中本项目后，把下面对应任务段落作为 prompt 发给 agent。
> 严格遵守同目录 `DESIGN.md` 品牌契约。事实以 `AGENTS.md` 为准（冲突时 AGENTS.md 优先）。

---

## ⚠️ 先读：本文件的范围已收窄

**官网页面已经用代码落地了，不要再让 open-design 生成官网页面。**

- 站点已是 **Next.js + Tailwind** 多页实现：`/`（公司主页）、`/proposalpilot`（智小申）、`/scholarpilot`（科小文占位）。
- 设计令牌已从 `design-system.tokens.md` 落进 `tailwind.config.ts` + `app/globals.css`，并已验证生效。
- 旧版 BRIEF 让 open-design 做「长滚动单页官网」——**那个方案已废弃**，照做会产出与现有代码冲突的产物。

**open-design 现在只负责下面三件事：logo 定稿、图标衍生、社交分享卡。**

---

## 任务 0 · 通用约束（每次都带上）

严格遵守本项目 `DESIGN.md`。视觉走「极客科技 · 克制」：近黑 `#0A0A0B` 背景、近白 `#F5F5F7` 文字、荧光青绿 `#00E5A0` 只做点睛强调（`#00B37E` 为暗态）。标题几何无衬线（Inter / Geist / HarmonyOS Sans），数据/标签用等宽（Geist Mono / JetBrains Mono）。大量留白。

**禁忌**：彩色渐变堆砌、拟物阴影、emoji 当装饰、廉价 3D 机器人插画。

产出真实 SVG / HTML / CSS 文件，可导出。

---

## 任务 1 · Logo 定稿（核心任务）

按 `DESIGN.md` §6 为「溥源科技」定稿 logo。意象：**中心源点 + 外扩涟漪环 + 卫星节点**，呼应「溥源」= 广博之源。

### ⚠️ 必须解决的设计问题：卫星节点数量

现有草稿 `assets/logo-mark.svg` 只画了**一个**卫星节点。但：

- 品牌故事是「**一源驱动多 agent**」（`DESIGN.md` §1）；
- 公司 tagline 已定为「**从知识源头，驱动专业 agent**」——刻意不锁产品数量，因为**未来会持续增加新 agent**；
- 当前已有两款（智小申、科小文），后续还会加。

单节点的图形语言和这个故事互相矛盾，且会随新 agent 上线而过时。**请给出多节点方案**，并满足：

- 节点数**不暗示确切产品数**（不要正好画 2 个，否则第三个 agent 上线就过时）——建议 3 个或以上不对称分布，读作「持续扩散」而非「计数」；
- 缩到 16×16 favicon 时仍可辨识（节点不能糊成一团）；
- 保持克制，不要变成星系图或电路板。

### 产出三种形态

1. **纯图标 mark** — 正方形，适配 favicon / app icon，16px 下可辨识
2. **图标 + 中文字标「溥源科技」** — 横版
3. **英文字标 PUYUAN 版** — 横版（当前 Nav 用的是 `PUYUAN` 字标 + mark 组合）

参考起点 `assets/logo-mark.svg`、`assets/logo-full.svg`（**手写草稿，非最终稿，可推翻重做**）。全部导出 SVG，深色背景版必需，浅色背景版可选。

---

## 任务 2 · 图标衍生（logo 定稿后再做）

基于任务 1 定稿的 mark，产出站点图标全套：

- `icon.svg` — 主图标（Next.js 放 `app/icon.svg` 自动接管 favicon）
- `favicon.ico` — 32×32 传统回退
- `apple-icon.png` — 180×180，iOS 添加到主屏用（**需要不透明背景**，用 `#0A0A0B`，不要透明底）
- 可选：`icon-192.png` / `icon-512.png`（PWA maskable，留足安全边距）

小尺寸下允许简化：涟漪环可减到一到两圈，保住源点 + 至少一个节点的识别度。

---

## 任务 3 · 社交分享卡（OG image）

产出 **1200×630** 的分享卡，用于微信/X/Slack 等展开预览。当前站点 `openGraph` 尚未配图。

内容与版式：
- 近黑背景 + 定稿 logo
- 主文案：**从知识源头，驱动专业 agent**
- 副行：溥源科技 · PuYuan Tech
- 荧光青绿点睛，可用细描边或涟漪弧作背景纹理，克制
- 文字必须在缩略图尺寸下可读（预览常被压到 ~600px 宽）

**不要**在卡上枚举产品名 —— 未来会加新 agent，枚举会过时。

建议同时给一版通用卡（上述）。产品页专属卡（智小申 / 科小文）为可选项，若做则复用同一版式，只替换标题行。

---

## 已完成 / 不需要 open-design 再做

| 项目 | 状态 |
|---|---|
| 官网三个页面 | ✅ 已用 Next.js + Tailwind 代码实现 |
| 设计令牌（色板/字号/圆角/间距/阴影） | ✅ 已落进 `tailwind.config.ts` + `globals.css` 并验证生效 |
| 产品文案（主页 / 智小申 / 科小文） | ✅ 已写入各页面，事实源自 `_prd_zhishen.md` |
| GEO 技术层（Schema.org / llms.txt / sitemap / robots） | ✅ 已实现 |
| 公司 tagline | ✅ 已定：从知识源头，驱动专业 agent |

> 产品文案若要迭代，改代码里的文案即可，不必回到 open-design。
