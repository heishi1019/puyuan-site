const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const baseUrl = process.env.SCHOLAR_BASE_URL || "http://127.0.0.1:3000/scholarpilot";

async function inspect(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const heading = page.locator(".scholar-roadmap .scholar-section-heading h2");
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const metrics = await heading.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      text: element.textContent,
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
      lineHeight: Number.parseFloat(style.lineHeight),
      whiteSpace: style.whiteSpace,
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });

  await page.close();
  return { viewport, metrics, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await inspect(browser, { width: 1900, height: 1080 });
  const mobile = await inspect(browser, { width: 390, height: 844 });
  await browser.close();

  console.log(JSON.stringify({ desktop, mobile }, null, 2));

  const desktopSingleLine = desktop.metrics.height <= desktop.metrics.lineHeight * 1.15;
  const valid =
    desktopSingleLine &&
    desktop.metrics.whiteSpace === "nowrap" &&
    mobile.metrics.whiteSpace === "normal" &&
    desktop.metrics.scrollWidth <= desktop.metrics.innerWidth &&
    mobile.metrics.scrollWidth <= mobile.metrics.innerWidth &&
    desktop.errors.length === 0 &&
    mobile.errors.length === 0;

  if (!valid) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
