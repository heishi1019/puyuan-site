/**
 * 品牌位图素材生成器（本地一次性工具，非构建步骤）
 *
 * 为什么产物要提交进仓库、而不是在构建时生成：
 *   本脚本用系统安装的中文字体（Microsoft YaHei）栅格化中文文案。
 *   Vercel 的 Linux 构建环境没有这个字体，构建时跑会 fallback 成豆腐块。
 *   所以：本地跑一次 → 提交 PNG → 构建只读取 PNG。
 *
 * 用法：node scripts/gen-brand-assets.mjs
 * 何时重跑：logo 或 tagline 变更后。
 *
 * 产物：
 *   app/apple-icon.png        180×180   iOS 主屏图标
 *   app/opengraph-image.png  1200×630   社交分享卡（微信/X/Slack 等）
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── 设计令牌（与 tailwind.config.ts / globals.css 保持一致）── */
const BG = "#0A0A0B";
const SURFACE = "#141416";
const BORDER = "#26262A";
const TEXT = "#F5F5F7";
const MUTED = "#8A8A93";
const ACCENT = "#00E5A0";

const TAGLINE = "从知识源头，驱动专业 agent";
const SANS = "Microsoft YaHei, Inter, sans-serif";
const MONO = "Consolas, Geist Mono, monospace";

/** 源点 + 涟漪环 + 卫星节点。cx/cy 为源点中心，r 为最外环半径。 */
function logoMark(cx, cy, r) {
  const satAngle = -Math.PI / 4; // 右上 45°
  const satR = r * 0.72;
  const sx = cx + Math.cos(satAngle) * satR;
  const sy = cy + Math.sin(satAngle) * satR;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}"        stroke="${ACCENT}" stroke-width="${r * 0.024}" fill="none" opacity="0.28"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" stroke="${ACCENT}" stroke-width="${r * 0.028}" fill="none" opacity="0.55"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.44}" stroke="${ACCENT}" stroke-width="${r * 0.032}" fill="none" opacity="0.9"/>
    <line x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}" stroke="${ACCENT}" stroke-width="${r * 0.024}" opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="${ACCENT}"/>
    <circle cx="${sx}" cy="${sy}" r="${r * 0.14}" fill="${ACCENT}"/>`;
}

/* ── OG 卡 1200×630 ── */
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${BG}"/>
  <circle cx="250" cy="315" r="300" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="630" fill="none" stroke="${BORDER}" stroke-width="2"/>
  <rect x="0" y="0" width="1200" height="4" fill="${ACCENT}" opacity="0.85"/>

  ${logoMark(250, 315, 132)}

  <text x="470" y="268" font-family="${SANS}" font-size="82" font-weight="600" fill="${TEXT}">溥源科技</text>
  <text x="474" y="322" font-family="${MONO}" font-size="33" fill="${MUTED}" letter-spacing="3">PuYuan Tech</text>
  <line x1="474" y1="360" x2="700" y2="360" stroke="${BORDER}" stroke-width="2"/>
  <text x="474" y="424" font-family="${SANS}" font-size="41" font-weight="500" fill="${ACCENT}">${TAGLINE}</text>

  <rect x="474" y="470" width="234" height="46" rx="23" fill="${SURFACE}" stroke="${BORDER}" stroke-width="1.5"/>
  <circle cx="500" cy="493" r="4.5" fill="${ACCENT}"/>
  <text x="516" y="501" font-family="${MONO}" font-size="21" fill="${MUTED}">AI-native · agent</text>
</svg>`;

/* ── Apple touch icon 180×180 ── */
const appleSvg = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="${BG}"/>
  ${logoMark(90, 90, 62)}
</svg>`;

const targets = [
  ["app/opengraph-image.png", ogSvg, 1200, 630],
  ["app/apple-icon.png", appleSvg, 180, 180],
];

for (const [rel, svg, w, h] of targets) {
  const png = await sharp(Buffer.from(svg), { density: 144 })
    .resize(w, h)
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(ROOT, rel), png);
  console.log(`✔ ${rel}  ${w}×${h}  ${(png.length / 1024).toFixed(1)} KB`);
}
