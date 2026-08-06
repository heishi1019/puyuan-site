#!/usr/bin/env node
/**
 * Mechanical acceptance checks for things a green `next build` does NOT prove.
 *
 * Every check here exists because it failed silently at some point:
 *  1. Tailwind v4 dropped JS-config auto-loading. Without `@config` in
 *     globals.css the whole token file is ignored and the build still passes,
 *     because Tailwind skips unknown utilities without erroring.
 *  2. Token font values were mapped to class slots the markup never used, so
 *     h2 rendered larger than h1 on 8 elements.
 *  3. `alternates.canonical` in layout.tsx is INHERITED by every child page,
 *     making each one declare itself a duplicate of the homepage.
 *  4. OG/apple-icon PNGs were reported as generated while app/ held only an SVG.
 *
 * Run: npm run verify:tokens   (requires `next build` to have run first)
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
const pass = (name, detail = "") => results.push({ ok: true, name, detail });
const fail = (name, detail = "") => results.push({ ok: false, name, detail });

const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

/* ── 1. token utilities actually exist in the built CSS ─────────────── */
{
  const cssDir = join(ROOT, ".next", "static", "css");
  if (!existsSync(cssDir)) {
    fail("built CSS present", "no .next/static/css — run `next build` first");
  } else {
    const css = readdirSync(cssDir)
      .filter((f) => f.endsWith(".css"))
      .map((f) => readFileSync(join(cssDir, f), "utf8"))
      .join("\n");

    // These only exist if tailwind.config.ts was actually loaded.
    const required = [
      "text-accent",
      "bg-surface",
      "bg-bg",
      "text-muted",
      "border-border",
      "py-section",
      "rounded-pill",
    ];
    const missing = required.filter((u) => !css.includes(`.${u}`));
    if (missing.length) {
      fail(
        "design tokens compiled into CSS",
        `missing utilities: ${missing.join(", ")} — is @config present in globals.css?`
      );
    } else {
      pass("design tokens compiled into CSS", `${required.length} token utilities found`);
    }
  }
}

/* ── 2. @config directive present ───────────────────────────────────── */
{
  const css = read("app/globals.css");
  if (/@config\s+["']/.test(css)) {
    pass("@config directive present in globals.css");
  } else {
    fail("@config directive present in globals.css", "tailwind.config.ts will be silently ignored");
  }
}

/* ── 3. font ladder strictly ascending across the slots in use ──────── */
{
  const cfg = read("tailwind.config.ts");
  const order = ["base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
  const sizes = {};
  for (const slot of order) {
    // Key may be bare (lg:) or quoted ("2xl":); value may be a bare string or
    // a [size, {lineHeight}] tuple; unit may be rem or px. All are normalised
    // to px so the comparison below is unit-agnostic.
    const re = new RegExp(
      `["']?${slot}["']?\\s*:\\s*\\[?\\s*["'](\\d+(?:\\.\\d+)?)(rem|px)["']`
    );
    const m = cfg.match(re);
    if (m) sizes[slot] = m[2] === "rem" ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
  }
  const found = order.filter((s) => s in sizes);
  if (found.length < 4) {
    fail("font ladder ascending", `only resolved ${found.length} sizes from tailwind.config.ts`);
  } else {
    const bad = [];
    for (let i = 1; i < found.length; i++) {
      const prev = found[i - 1];
      const cur = found[i];
      if (sizes[cur] <= sizes[prev]) bad.push(`${prev}(${sizes[prev]}) >= ${cur}(${sizes[cur]})`);
    }
    if (bad.length) {
      fail("font ladder ascending", bad.join("; "));
    } else {
      pass(
        "font ladder ascending",
        found.map((s) => `${s}:${sizes[s]}`).join(" < ")
      );
    }
  }
}

/* ── 4. canonical is per-page, never site-wide in layout.tsx ────────── */
{
  const layout = read("app/layout.tsx");
  // strip line + block comments so the warning note doesn't trip the check
  const code = layout.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  if (/alternates\s*:/.test(code) && /canonical/.test(code)) {
    fail(
      "no site-wide canonical in layout.tsx",
      "child pages inherit it and each declares itself a duplicate of /"
    );
  } else {
    pass("no site-wide canonical in layout.tsx");
  }

  const pages = ["app/page.tsx", "app/proposalpilot/page.tsx", "app/scholarpilot/page.tsx"];
  const noCanon = pages.filter((p) => {
    if (!existsSync(join(ROOT, p))) return true;
    return !/canonical\s*:/.test(read(p));
  });
  if (noCanon.length) {
    fail("every page declares its own canonical", `missing in: ${noCanon.join(", ")}`);
  } else {
    pass("every page declares its own canonical", `${pages.length} pages`);
  }
}

/* ── 5. brand assets exist on disk with sane sizes ──────────────────── */
{
  const assets = [
    { rel: "app/icon.svg", min: 200 },
    { rel: "app/apple-icon.png", min: 2000 },
    { rel: "app/opengraph-image.png", min: 20000 },
  ];
  const bad = [];
  for (const a of assets) {
    const abs = join(ROOT, a.rel);
    if (!existsSync(abs)) {
      bad.push(`${a.rel} MISSING`);
      continue;
    }
    const size = statSync(abs).size;
    if (size < a.min) bad.push(`${a.rel} only ${size}B (expected >=${a.min})`);
  }
  if (bad.length) {
    fail("brand assets on disk", bad.join("; "));
  } else {
    pass("brand assets on disk", assets.map((a) => a.rel.replace("app/", "")).join(", "));
  }
}

/* ── 6. SITE_URL is the single source of truth ──────────────────────── */
{
  const schema = read("lib/schema.ts");
  // Accept either a plain string literal OR an env-var expression with a string fallback.
  //   export const SITE_URL = "https://..."
  //   export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://...").replace(...)
  const mPlain = schema.match(/export const SITE_URL\s*=\s*["']([^"']+)["']/);
  const mEnv   = schema.match(/NEXT_PUBLIC_SITE_URL.*?["']([^"']+)["']/);
  const m = mPlain ?? mEnv;
  if (!m) {
    fail("SITE_URL defined in lib/schema.ts");
  } else {
    const url = m[1];
    if (url.endsWith("/")) {
      fail("SITE_URL has no trailing slash", url);
    } else {
      const form = mPlain ? "literal" : "env-var";
      pass("SITE_URL defined", `${url}  (${form})`);
    }
    // sitemap + robots must derive from it, not hardcode a domain
    for (const rel of ["app/sitemap.ts", "app/robots.ts"]) {
      if (!existsSync(join(ROOT, rel))) {
        fail(`${rel} exists`);
        continue;
      }
      const src = read(rel);
      if (!src.includes("SITE_URL")) {
        fail(`${rel} derives from SITE_URL`, "hardcoded domain will drift");
      } else if (/https?:\/\/(?!localhost)/.test(src)) {
        fail(`${rel} has no hardcoded domain`, "found a literal http(s) URL");
      } else {
        pass(`${rel} derives from SITE_URL`);
      }
    }
  }
}

/* ── report ─────────────────────────────────────────────────────────── */
const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "✔" : "✘"} ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
