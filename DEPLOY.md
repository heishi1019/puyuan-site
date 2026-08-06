# 部署指南

配置：私有 GitHub 仓库 + Vercel（免费 Hobby 计划即可）。无自定义域名时先用 Vercel 分配的临时域名，到手域名后一行切换。

---

## 第一步：推送到 GitHub 私有仓库

```bash
gh repo create puyuan-site --private --source . --remote origin --push
```

如果没有 `gh` CLI，手动方式：
1. 在 github.com 新建私有仓库，名字随意（建议 `puyuan-site`）
2. 复制仓库地址，然后：

```bash
git remote add origin https://github.com/你的用户名/puyuan-site.git
git push -u origin main
```

---

## 第二步：在 Vercel 导入仓库

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 点 **Import Git Repository** → 选 `puyuan-site`
3. Framework Preset 会自动识别为 **Next.js**，不用改
4. 点 **Deploy**

首次部署完成后，Vercel 会分配一个类似 `puyuan-site-xxx.vercel.app` 的域名。

---

## 第三步：设置 SITE_URL 环境变量

`lib/schema.ts` 里的 `SITE_URL` 由环境变量 `NEXT_PUBLIC_SITE_URL` 控制。

1. Vercel 项目页面 → **Settings → Environment Variables**
2. 新建变量：
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://puyuan-site-xxx.vercel.app`（填你实际拿到的域名，无尾部斜杠）
   - Environment: Production + Preview + Development 全勾
3. 回到 **Deployments** 页面，点 **Redeploy**（否则变量不生效）

验证：部署完成后查看 `https://你的域名/sitemap.xml`，`<loc>` 里的地址应与你设的域名一致。

---

## 第四步（可选）：到手自定义域名后切换

1. Vercel → Settings → Domains → 添加 `www.puyuan.tech`
2. 按提示在域名注册商加 DNS 记录（通常是 CNAME 指向 `cname.vercel-dns.com`）
3. DNS 生效后，回 Environment Variables，把 `NEXT_PUBLIC_SITE_URL` 改成 `https://www.puyuan.tech`
4. Redeploy

就这一步，其他任何文件都不用改。

---

## 验收清单（`npm run check` 覆盖不到的部分）

```
□ /sitemap.xml 里的 <loc> 域名与实际访问地址一致
□ /robots.txt Sitemap 行指向正确地址
□ 三页 <link rel="canonical"> 各自不同（/ / /proposalpilot / /scholarpilot）
□ OG 图可在 https://developers.facebook.com/tools/debug/ 预览
□ https://search.google.com/test/rich-results 识别出 Organization / FAQPage schema
□ llms.txt 可访问（直接打开 /llms.txt）
□ _prd_zhishen.md 不在已部署页面上可访问（仓库私有即可保证）
```

---

## 关于 _prd_zhishen.md

文件已加入 `.gitignore` 并从当前 HEAD 移除，但存在于第一个 commit（`db896cc`）的历史中。
**仓库私有时这不构成风险**——私有仓库的 git history 只有你自己能访问。
如果将来想彻底清除（例如改开源），需要 `git filter-repo` 重写历史，那时再处理即可。
