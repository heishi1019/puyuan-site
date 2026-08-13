const { chromium } = require(process.env.SCHOLAR_PLAYWRIGHT_MODULE);
const baseUrl = process.env.SCHOLAR_BASE_URL || "http://127.0.0.1:3000";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/scholarpilot`, { waitUntil: "networkidle" });
  const stickyContext = await page.locator('[class*="manuscriptFrame"]').evaluate((element) => {
    const ancestors = [];
    let current = element;
    while (current) {
      const style = getComputedStyle(current);
      ancestors.push({ tag: current.tagName, className: current.className, position: style.position, overflow: style.overflow });
      current = current.parentElement;
    }
    return ancestors;
  });
  const stages = page.locator("article[data-index]").filter({ has: page.locator("button[aria-pressed]") });
  const stageResults = [];
  for (let index = 0; index < 3; index += 1) {
    await stages.nth(index).evaluate((element) => element.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(850);
    stageResults.push({
      index,
      active: await stages.nth(index).getAttribute("data-active"),
      document: await page.locator('[class*="documentState"][data-visible="true"] h3').innerText(),
      frameBox: await page.locator('[class*="manuscriptFrame"]').boundingBox(),
      listBox: await page.locator('[class*="stageList"]').boundingBox(),
    });
  }
  await page.screenshot({ path: "qa-scholar-journey-stage-3.png" });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/scholarpilot`, { waitUntil: "networkidle" });
  const mobileMetrics = await mobile.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    stickyPosition: getComputedStyle(document.querySelector('[class*="manuscriptFrame"]')).position,
    faqCount: document.querySelectorAll("dl dt").length,
    schemaCount: document.querySelectorAll('script[type="application/ld+json"]').length,
  }));

  console.log(JSON.stringify({ stickyContext, stageResults, mobileMetrics, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
