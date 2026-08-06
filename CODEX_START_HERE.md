# 给 Codex 的启动指令 — 智小申页面 /proposalpilot

## 你的任务

你是 Codex，负责在已有的 Next.js 项目骨架上实现 **智小申（ProposalPilot）产品页**。  
Claude 负责主页 `/` 和科小文页 `/scholarpilot`，已经完成。  
你只需要新建 `app/proposalpilot/page.tsx`，不要修改其他文件。

---

## 第一步：读这些文件

1. `AGENTS.md` — 完整项目背景、品牌约束、分工说明（特别是 §1、§2、§3、§6）  
2. `_prd_zhishen.md` — 智小申 PRD v3.4，所有产品事实来自这里  
3. `app/page.tsx` — 主页，看 Claude 用了哪些组件和写法，保持风格一致  
4. `lib/schema.ts` — GEO 工具函数，你要用 `softwareAppSchema` 和 `faqSchema`  
5. `tailwind.config.ts` — 设计令牌

---

## 你要交付的文件

**`app/proposalpilot/page.tsx`** — 智小申深度产品页，长滚动，按以下结构实现：

```
1. Hero
   - 产品名：智小申 / ProposalPilot
   - 一句话定位（从 PRD 提取，GEO 友好，可被 AI 引擎直接摘引）
   - 主 CTA：免费试用 → https://app.puyuan.tech
   - 次 CTA：预约 Demo

2. 解决什么问题（痛点）
   - 不知道能报什么 / 政策信息散乱
   - 材料证据互相矛盾，打架
   - 没有专职申报人

3. 五步工作流（横向或纵向步骤流）
   发现机会 → 诊断资格 → 编制材料 → 质检定稿 → 申报提醒与立项陪伴

4. 证据核查引擎（核心护城河，重点展开）
   - 跨 200 页材料，6 大类 14 项核查
   - 发现互相矛盾的数字、断裂的证据链
   - 通用大模型做不到跨文件一致性追踪

5. 能力边界与真实性红线
   - 硬门槛类（高企/研发费加计）给强判断
   - 竞争性评审类只提升竞争力，不承诺「包过」
   - 每个结论须映射真实证据，无据标红不写入

6. 数据主权
   - 私有化：数据完全不出内网
   - 云端：签约不保存、不训练、加密传输

7. 面向两类用户（双栏）
   - 中小企业主 / 行政财务兼职申报人
   - 大企业政府事务专员 / 第三方申报代理

8. FAQ（至少 4 条，围绕企业申报真实问题，GEO 用）

9. CTA + 返回首页链接
```

---

## 技术规范

- 文件位置：`app/proposalpilot/page.tsx`
- **不要**修改 `app/layout.tsx`、`components/`、`lib/` 内任何文件
- 导入共享组件：`import Button from "@/components/Button"`、`import Card from "@/components/Card"`
- GEO JSON-LD：在页面顶部 embed `softwareAppSchema` + `faqSchema`（参考 `app/page.tsx` 的写法）
- `export const metadata: Metadata = { title: "智小申 ProposalPilot", description: "..." }` 必须有
- 文案全部从 `_prd_zhishen.md` 提取，**不要编造**数字或功能
- 语气遵守品牌契约（AGENTS.md §3）：禁用「赋能/颠覆/革命性 AI」，说具体的事，给流程/数字/边界

---

## 关键事实（不要写错）

- 做的是**政府项目申报**（高企认定、研发费加计、专项资金），**不是**国自然/课题/学术基金
- 对外名称统一「**智小申**」，不用「智申」（PRD 内部标题是「智申」，属历史名）
- 英文名 **ProposalPilot Agent**（**含** Agent 后缀，用户 2026-08-06 确认；路由 `/proposalpilot` 不带后缀）
- 覆盖：科技、发改、工信、人才、市场监管、商务六大主管部门，国家级/省部级/地市级三层级，150+ 项目类型
- 2 个真 Agent（申报总管 + 撰稿），6 道人工门控 G1–G6
