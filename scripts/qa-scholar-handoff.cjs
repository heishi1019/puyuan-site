const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const inspect = async (page, screenshotPath) => {
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:3017/scholarpilot", { waitUntil: "networkidle" });
    const section = page.locator('[class*="handoffSection"]');
    await section.scrollIntoViewIfNeeded();
    await page.locator('[class*="handoffSteps"] button').nth(1).hover();
    await page.waitForTimeout(700);
    await section.screenshot({ path: screenshotPath });
    return page.evaluate(() => {
      const steps = document.querySelector('[class*="handoffSteps"]');
      const preview = document.querySelector('[class*="handoffPreview"]');
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        activeSteps: [...steps.querySelectorAll("li")].map((item) => item.dataset.active),
        visibleScenes: preview.querySelectorAll('[data-visible="true"]').length,
        previewBox: preview.getBoundingClientRect().toJSON(),
      };
    });
  };

  const desktop = await inspect(
    await browser.newPage({ viewport: { width: 1440, height: 900 } }),
    "qa-scholar-handoff-desktop.png",
  );
  const mobile = await inspect(
    await browser.newPage({ viewport: { width: 412, height: 915 } }),
    "qa-scholar-handoff-mobile.png",
  );
  const reducedPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await reducedPage.goto("http://127.0.0.1:3017/scholarpilot", { waitUntil: "networkidle" });
  const reducedMotion = await reducedPage.locator('[class*="previewScene"]').first().evaluate((element) => ({
    transitionDuration: getComputedStyle(element).transitionDuration,
    cursorAnimation: getComputedStyle(document.querySelector('[class*="previewCursor"]')).animationName,
  }));

  console.log(JSON.stringify({ desktop, mobile, reducedMotion, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
