const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  desktop.on("pageerror", (error) => errors.push(error.message));
  await desktop.goto("http://127.0.0.1:3017/proposalpilot", { waitUntil: "networkidle" });

  const sheets = desktop.locator(".gate-sheet");
  const stickyContext = await sheets.first().evaluate((element) => {
    const ancestors = [];
    let current = element;
    while (current) {
      const style = getComputedStyle(current);
      ancestors.push({ tag: current.tagName, className: current.className, position: style.position, overflow: style.overflow, transform: style.transform });
      current = current.parentElement;
    }
    return ancestors;
  });
  const states = [];
  for (const index of [0, 2, 4, 5]) {
    await sheets.nth(index).evaluate((element) => {
      const top = window.scrollY + element.getBoundingClientRect().top - 118;
      window.scrollTo({ top, behavior: "instant" });
    });
    await desktop.waitForTimeout(350);
    states.push({
      index,
      boxes: await sheets.evaluateAll((elements) => elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { top: Math.round(box.top), bottom: Math.round(box.bottom) };
      })),
    });
  }
  await desktop.screenshot({ path: "qa-proposal-gate-stack-desktop.png" });

  const compact = await browser.newPage({ viewport: { width: 1000, height: 443 } });
  await compact.goto("http://127.0.0.1:3017/proposalpilot", { waitUntil: "networkidle" });
  const compactSheets = compact.locator(".gate-sheet");
  await compactSheets.nth(4).evaluate((element) => {
    const top = window.scrollY + element.getBoundingClientRect().top - 92;
    window.scrollTo({ top, behavior: "instant" });
  });
  await compact.waitForTimeout(300);
  const compactG4 = await compact.evaluate(() => {
    const sheets = [...document.querySelectorAll(".gate-sheet")];
    const current = sheets[4].getBoundingClientRect();
    const next = sheets[5].getBoundingClientRect();
    return { currentTop: Math.round(current.top), currentBottom: Math.round(current.bottom), nextTop: Math.round(next.top) };
  });
  await compact.screenshot({ path: "qa-proposal-gate-stack-compact.png" });
  await compact.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
  await compact.waitForTimeout(250);
  const compactOverlap = await compact.evaluate(() => {
    const sheets = [...document.querySelectorAll(".gate-sheet")];
    const current = sheets[4].getBoundingClientRect();
    const next = sheets[5].getBoundingClientRect();
    return { currentTop: Math.round(current.top), currentBottom: Math.round(current.bottom), nextTop: Math.round(next.top), overlap: Math.max(0, Math.round(current.bottom - next.top)) };
  });
  await compact.screenshot({ path: "qa-proposal-gate-stack-overlap.png" });
  await compactSheets.nth(5).evaluate((element) => {
    const top = window.scrollY + element.getBoundingClientRect().top - 96;
    window.scrollTo({ top, behavior: "instant" });
  });
  await compact.waitForTimeout(300);
  const compactLast = await compact.evaluate(() => {
    const last = document.querySelector(".gate-sheet:last-child").getBoundingClientRect();
    const stack = document.querySelector(".gate-stack").getBoundingClientRect();
    return { lastTop: Math.round(last.top), lastBottom: Math.round(last.bottom), stackBottom: Math.round(stack.bottom) };
  });

  const mobile = await browser.newPage({ viewport: { width: 412, height: 915 } });
  mobile.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto("http://127.0.0.1:3017/proposalpilot", { waitUntil: "networkidle" });
  await mobile.locator(".gate-sheet").nth(1).scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(250);
  await mobile.screenshot({ path: "qa-proposal-gate-stack-mobile.png" });
  const mobileMetrics = await mobile.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    sheetCount: document.querySelectorAll(".gate-sheet").length,
    positions: [...document.querySelectorAll(".gate-sheet")].map((element) => getComputedStyle(element).position),
  }));

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await reduced.goto("http://127.0.0.1:3017/proposalpilot", { waitUntil: "networkidle" });
  const reducedAnimation = await reduced.locator(".gate-sheet").first().evaluate((element) => getComputedStyle(element).animationName);

  console.log(JSON.stringify({ stickyContext, states, compactG4, compactOverlap, compactLast, mobileMetrics, reducedAnimation, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
