# 溥源科技官网 — 视觉重设计交接文档

**发起方：** Claude（负责 GEO 层 + 验收）  
**执行方：** Codex（负责全站视觉重设计）  
**目标：** 在完全保留现有内容、数据和 GEO 基础设施的前提下，将页面从"能跑"升级为"好看"。

---

## 1. 项目概况

| 项目 | 值 |
|---|---|
| 公司 | 杭州溥源智能科技有限公司（溥源科技 / PuYuan Tech） |
| 定位 | AI-native 专业 agent 公司 |
| 产品 | 智小申 ProposalPilot Agent（政府项目申报）、科小文 ScholarPilot Agent（学术写作） |
| 技术栈 | Next.js 15.3.4 · App Router · Tailwind CSS v4 · TypeScript |
| 部署 | Vercel（私有 GitHub 仓库） |

---

## 2. 文件结构

```
app/
  layout.tsx          — 全站 Nav + Footer，含 metadata base
  page.tsx            — 首页 /
  proposalpilot/
    page.tsx          — 智小申产品页 /proposalpilot
  scholarpilot/
    page.tsx          — 科小文产品页 /scholarpilot
  globals.css         — Tailwind 入口 + CSS 变量
  icon.svg            — favicon（Next.js 自动注入）
  apple-icon.png      — 180×180，已生成
  opengraph-image.png — 1200×630，已生成

components/
  Nav.tsx
  Footer.tsx
  Button.tsx
  Card.tsx

lib/
  schema.ts           — GEO：SITE_URL + Schema.org 函数（禁止改动）

public/
  logo-mark.svg       — 图标版 logo（28×28 in Nav）
  logo-full.svg       — 横版完整 logo
  llms.txt            — AI 爬虫专用文本（禁止改动）

tailwind.config.ts    — 设计 token（颜色/字号/圆角/阴影）
```

---

## 3. 设计 Token（必须使用，禁止绕过）

### 颜色
| Token | 值 | 用途 |
|---|---|---|
| `bg-bg` | `#0A0A0B` | 页面背景 |
| `bg-surface` | `#141416` | 卡片/面板背景 |
| `border-border` | `#26262A` | 边框 |
| `text-text` | `#F5F5F7` | 主文字 |
| `text-muted` | `#8A8A93` | 次要文字 |
| `text-accent` / `bg-accent` | `#00E5A0` | 主强调色（绿） |
| `bg-accent-dim` | `#00B37E` | 强调色暗版 |
| `bg-accent-hover` | `#27F2AE` | hover 状态 |

CSS 变量在 `globals.css` 中也有定义（`var(--accent)` 等），可在任意 CSS 中使用。

### 字号（rem → 实际 px）
| 类名 | px | 用途 |
|---|---|---|
| `text-5xl` | 64 | h1 桌面（英雄区） |
| `text-4xl` | 40 | h1 移动端 |
| `text-3xl` | 28 | section h2 |
| `text-xl` | 20 | h3 / 大段引言 |
| `text-base` | 16 | 正文 |
| `text-sm` | 14 | 辅助说明 |

### 圆角
`rounded-sm`(6) · `rounded-md`(10) · `rounded-lg`(16) · `rounded-pill`(9999)

### 阴影
`shadow-glow` — `0 0 24px rgba(0,229,160,0.25)`，用于 accent 元素的光晕效果  
`shadow-glow-lg` — 更大范围的光晕

### 间距
`py-section` = 96px，页面级 section 上下间距标准值

---

## 4. ⚠️ Tailwind v4 关键陷阱

`globals.css` 必须保留第 3 行：
```css
@config "../tailwind.config.ts";
```
**Tailwind v4 不再自动加载 JS 配置文件。** 删掉这行，所有 Token（`text-accent`、`bg-surface`、`py-section` 等）会静默失效，但 `next build` 依然返回 ✅。这是本项目最危险的静默失败点。

---

## 5. 禁止修改的内容（GEO 基础设施）

以下内容与搜索引擎和 AI 爬虫权重直接相关，**一字不改**：

### 每页 metadata 对象
```tsx
// app/page.tsx
export const metadata: Metadata = {
  title: "溥源科技 · PuYuan Tech",
  description: "溥源科技（PuYuan Tech）是一家 AI-native 公司...",
  alternates: { canonical: "/" },   // ← 每页各自不同，不能删
};
```
`alternates.canonical` 三页各不相同（`/`、`/proposalpilot`、`/scholarpilot`），必须保留。

### Schema.org JSON-LD 注入
每页的 `<script type="application/ld+json">` 块及其数据完全不改。

### `auditTypes` 数组（proposalpilot/page.tsx）
```tsx
const auditTypes = [
  "数值一致性", "证据-主张映射", "证据链闭环",
  "跨维度逻辑一致性", "量化表述密度", "检测机构可信度",
];
```
这 6 个词来自 PRD §4.3 F-MAT-04，是产品核心护城河，不能改写为近义词或缩写。

### 其他不可碰文件
- `lib/schema.ts` — SITE_URL + Schema.org 函数
- `app/sitemap.ts` — XML sitemap
- `app/robots.ts` — robots.txt
- `public/llms.txt` — AI 爬虫索引
- `app/icon.svg`、`app/apple-icon.png`、`app/opengraph-image.png`
- `scripts/verify-tokens.mjs` — 验收脚本
- `package.json` 里的 `check` / `verify:tokens` 脚本

---

## 6. 可以改动的范围

**全部 JSX / HTML 结构** — 完全自由，重写整个布局都行  
**所有 className** — 完全自由，只要用的是 token 里的类  
**`components/`** — Nav、Footer、Button、Card 可完全重写，也可新建组件  
**新增任何组件文件** — `components/` 下随意添加  
**`globals.css`** — 可添加新样式，但要保留前 3 行（import + config）  
**图片/SVG 装饰素材** — `public/` 下可添加装饰图形

---

## 7. 设计方向

目标视觉参考：**Linear · Vercel · Resend** — 现代暗色调 SaaS landing page。

### 首页 `/`
- **Hero**：大标题 + 副标题 + CTA 按钮，背景可用径向渐变或柔和噪点纹理，accent 颜色光晕
- **产品卡片区**：两张卡片横排（桌面），有悬停光晕，点击进入产品页
- **为什么选溥源**：4 个 pillar，图标更精致（可用 SVG inline 图标）
- **FAQ**：可折叠手风琴
- **CTA 横幅**：底部注册引导

### 产品页 `/proposalpilot`
- **Hero**：产品名 + 定位句 + 双 CTA（试用 + 预约 Demo）
- **五步工作流**：横向 steps 或带连接线的流程图
- **证据核查引擎**：6 个 badge/chip 展示 `auditTypes`，配说明文字
- **双栏用户场景**：左右对比卡片
- **FAQ**：手风琴

### 产品页 `/scholarpilot`
- 与 proposalpilot 视觉语言一致，但整体色调可偏学术感

### 共用组件
- **Nav**：可加移动端汉堡菜单（当前没有）
- **Button**：primary 用 accent 背景，secondary 用描边，尺寸系统保持
- **Card**：`bg-surface` + `border-border`，hover 时 `border-accent/40` + `shadow-glow`

### 设计原则
1. 黑底、弱边框、accent 绿色作为唯一高亮色
2. 文字对比度符合 WCAG AA（主文字 `#F5F5F7` on `#0A0A0B` 已满足）
3. 中英文混排：中文用系统字体回退，英文产品名保持 Inter
4. 移动端优先：375px 无横向溢出

---

## 8. 开发流程

```bash
npm run dev       # 开发服务器 localhost:3000
npm run build     # 生产构建（必须通过）
npm run check     # = tsc + build + 9项机械检查（验收前必须全绿）
```

`npm run check` 会检查：
- Token 是否真正编译进 CSS（`text-accent`、`bg-surface` 等 7 个）
- `@config` 指令是否存在
- 字号梯次是否严格递增
- 是否有全局 canonical 污染 layout.tsx
- 三页是否各有独立 canonical
- 品牌图片是否存在且大小合理
- SITE_URL 是否有唯一来源

---

## 9. Claude 验收清单

Codex 完成后，Claude 会逐项检查：

**机械检查（自动）**
- [ ] `npm run check` 9/9 通过
- [ ] `tsc --noEmit` 无报错

**内容完整性（逐页核对）**
- [ ] `auditTypes` 6 个词与 PRD 原文完全一致
- [ ] FAQ 问答文本未被修改
- [ ] 每页 `alternates.canonical` 未被移除或改动
- [ ] Schema.org JSON-LD `<script>` 仍然存在于三页

**视觉验收（浏览器）**
- [ ] 首页 h1 字号 > h2 字号（不能倒置）
- [ ] 移动端 375px 无横向溢出
- [ ] `text-accent`（绿色）确实显示为 `#00E5A0` 而非 Tailwind 默认色
- [ ] 卡片 hover 光晕可见
- [ ] Nav 在所有页面可见且链接正确
- [ ] Footer 产品链接可正常跳转

**GEO 层（渲染产物）**
- [ ] `/sitemap.xml` 三个 `<loc>` 与 SITE_URL 一致
- [ ] `/robots.txt` 不屏蔽 GPTBot / ClaudeBot / PerplexityBot
- [ ] 首页 `<link rel="canonical" href="https://.../">` 存在
- [ ] OG 图 `<meta property="og:image">` 存在

---

## 10. 注意事项

1. **不要运行 `scripts/gen-brand-assets.mjs`**，它依赖 Windows 系统字体（`msyh.ttc`），在 CI/Mac 上会失败。OG 图和 apple-icon 已经生成在 `app/` 里，直接用即可。

2. **`_prd_zhishen.md` 不在仓库 HEAD 里**（已从 git 索引移除，本地磁盘保留）。这是内部商业文档，不要再次 `git add` 它。

3. **`package.json` 里没有 `"type": "module"`**，会有一个 Tailwind 相关的 Node.js Warning，属于已知问题，不影响构建。可以加 `"type": "module"` 消除警告，但不是必须的。

4. **Vercel 环境变量 `NEXT_PUBLIC_SITE_URL`**：本地开发不需要设置，构建时会用默认值 `https://puyuan-site.vercel.app`。
