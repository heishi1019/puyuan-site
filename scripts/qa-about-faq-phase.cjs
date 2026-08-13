const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const baseUrl = (process.env.SITE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

const scenarios = [
  { name: "about-desktop", path: "/about", viewport: { width: 1440, height: 900 }, target: ".company-identity" },
  { name: "about-mobile", path: "/about", viewport: { width: 390, height: 844 }, target: ".company-identity" },
  { name: "faq-desktop", path: "/faq", viewport: { width: 1440, height: 900 }, target: ".faq-body" },
  { name: "faq-mobile", path: "/faq", viewport: { width: 390, height: 844 }, target: ".faq-body" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const scenario of scenarios) {
    const page = await browser.newPage({ viewport: scenario.viewport });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`${baseUrl}${scenario.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `qa-${scenario.name}-hero.png`, fullPage: false });

    const target = page.locator(scenario.target);
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);

    if (scenario.path === "/faq") {
      const secondQuestion = page.locator(".faq-list details").nth(1);
      if (!(await secondQuestion.getAttribute("open"))) await secondQuestion.locator("summary").click();
      await page.waitForTimeout(420);
    }

    await page.screenshot({ path: `qa-${scenario.name}-content.png`, fullPage: false });

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const target = document.querySelector(".company-identity, .faq-body");
      const targetStyle = target ? getComputedStyle(target) : null;
      return {
        innerWidth: window.innerWidth,
        scrollWidth: root.scrollWidth,
        targetBackground: targetStyle?.backgroundColor || null,
        targetRadius: targetStyle?.borderTopLeftRadius || null,
        faqOpen: document.querySelectorAll(".faq-list details[open]").length,
      };
    });

    const valid = metrics.scrollWidth <= metrics.innerWidth
      && metrics.targetRadius !== "0px"
      && errors.length === 0
      && (scenario.path !== "/faq" || metrics.faqOpen >= 1);

    results.push({ ...scenario, metrics, errors, valid });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => !result.valid)) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
