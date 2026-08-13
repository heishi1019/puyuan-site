const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/proposalpilot`, { waitUntil: "networkidle" });
  await page.screenshot({ path: "qa-proposal-hero-clean.png" });
  const bodyText = await page.locator("body").innerText();
  const forbiddenLabels = [
    "CO-CREATION STAGE",
    "PROPOSALPILOT AGENT",
    "CURRENT STATUS",
    "WHY THIS PRODUCT",
    "PLANNING WORKFLOW",
    "CO-CREATION",
    "BOUNDARIES",
    "JOIN CO-CREATION",
  ].filter((label) => bodyText.includes(label));
  const covers = page.locator(".home-color-page--cover");
  const coverStates = [];

  for (let index = 0; index < await covers.count(); index += 1) {
    const cover = covers.nth(index);
    await cover.evaluate((element) => window.scrollTo({ top: element.offsetTop - window.innerHeight * 0.58 }));
    await page.waitForTimeout(220);
    coverStates.push(await cover.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        theme: element.dataset.pageTheme,
        motion: element.dataset.coverMotion || "landed",
        transform: style.transform,
        background: style.backgroundColor,
        top: element.getBoundingClientRect().top,
      };
    }));
  }

  await covers.nth(2).evaluate((element) => window.scrollTo({ top: element.offsetTop - window.innerHeight * 0.68 }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "qa-proposal-rebase-cover.png" });

  const yellowSmallText = await page.evaluate(() => Array.from(document.querySelectorAll("body *")).filter((element) => {
    const style = getComputedStyle(element);
    const hasOwnText = Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    return hasOwnText && style.color === "rgb(215, 255, 0)" && Number.parseFloat(style.fontSize) <= 14;
  }).map((element) => element.textContent.trim()));

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/proposalpilot`, { waitUntil: "networkidle" });
  const mobileMetrics = await mobile.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    coverCount: document.querySelectorAll(".home-color-page--cover").length,
    schemaCount: document.querySelectorAll('script[type="application/ld+json"]').length,
  }));

  console.log(JSON.stringify({ forbiddenLabels, coverStates, yellowSmallText, mobileMetrics, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
