const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  desktop.on("pageerror", (error) => errors.push(error.message));
  await desktop.goto("http://127.0.0.1:3017/scholarpilot", { waitUntil: "networkidle" });
  await desktop.screenshot({ path: "qa-scholar-v2-hero.png" });
  const desktopScenes = desktop.locator("section[id='capabilities'] article");
  await desktopScenes.nth(2).scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(900);
  await desktop.screenshot({ path: "qa-scholar-v2-scene.png" });
  const desktopMetrics = await desktop.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    sceneCount: document.querySelectorAll("section[id='capabilities'] article").length,
    scenePositions: [...document.querySelectorAll("section[id='capabilities'] article")].map((element) => getComputedStyle(element).position),
  }));

  const compact = await browser.newPage({ viewport: { width: 1000, height: 443 } });
  compact.on("pageerror", (error) => errors.push(error.message));
  await compact.goto("http://127.0.0.1:3017/scholarpilot", { waitUntil: "networkidle" });
  await compact.locator("section[id='capabilities'] article").nth(1).scrollIntoViewIfNeeded();
  await compact.waitForTimeout(700);
  await compact.screenshot({ path: "qa-scholar-v2-compact.png" });
  const compactMetrics = await compact.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));

  const mobile = await browser.newPage({ viewport: { width: 412, height: 915 } });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto("http://127.0.0.1:3017/scholarpilot", { waitUntil: "networkidle" });
  await mobile.screenshot({ path: "qa-scholar-v2-mobile.png", fullPage: true });
  const mobileMetrics = await mobile.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scenePositions: [...document.querySelectorAll("section[id='capabilities'] article")].map((element) => getComputedStyle(element).position),
  }));

  console.log(JSON.stringify({ desktopMetrics, compactMetrics, mobileMetrics, errors }, null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
