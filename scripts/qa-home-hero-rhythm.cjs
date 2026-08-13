const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const baseUrl = process.env.HOME_BASE_URL || "http://127.0.0.1:3000/";

async function inspectPage(browser, viewport, screenshot, reducedMotion = "no-preference") {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1100);

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return {
        top: Math.round(bounds.top),
        right: Math.round(bounds.right),
        bottom: Math.round(bounds.bottom),
        left: Math.round(bounds.left),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      };
    };

    const network = document.querySelector(".home-source-network");
    const signal = network ? getComputedStyle(network, "::after") : null;

    return {
      hero: rect(".phase-one-hero"),
      copy: rect(".phase-one-hero__copy"),
      subtitle: rect(".phase-one-hero__copy > p"),
      cta: rect(".phase-one-hero__cta"),
      network: rect(".home-source-network"),
      proposal: rect(".home-source-network__node--proposal"),
      source: rect(".home-source-network__source"),
      scholar: rect(".home-source-network__node--scholar"),
      nextSection: rect(".phase-one-capabilities"),
      capabilitySubtitle: rect(".phase-one-capabilities__heading p"),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      signalDisplay: signal?.display,
      signalAnimation: signal?.animationName,
    };
  });

  if (screenshot) await page.screenshot({ path: screenshot, fullPage: false });
  await context.close();
  return { viewport, reducedMotion, metrics, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktopViewport = {
    width: Number(process.env.QA_DESKTOP_WIDTH || 1440),
    height: Number(process.env.QA_DESKTOP_HEIGHT || 900),
  };
  const desktop = await inspectPage(browser, desktopViewport, "qa-home-hero-desktop.png");
  const mobile = await inspectPage(browser, { width: 390, height: 844 }, "qa-home-hero-mobile.png");
  const reduced = await inspectPage(browser, { width: 1440, height: 900 }, null, "reduce");
  await browser.close();

  const results = { desktop, mobile, reduced };
  console.log(JSON.stringify(results, null, 2));

  const desktopCards = [desktop.metrics.proposal, desktop.metrics.source, desktop.metrics.scholar];
  const desktopValid =
    desktop.metrics.cta.bottom < Math.min(...desktopCards.map((card) => card.top)) &&
    desktop.metrics.nextSection.top < desktop.viewport.height &&
    desktopCards.every((card) => card.left >= 0 && card.right <= desktop.viewport.width) &&
    desktop.metrics.scrollWidth <= desktop.metrics.innerWidth;
  const mobileCards = [mobile.metrics.proposal, mobile.metrics.source, mobile.metrics.scholar];
  const mobileValid =
    mobileCards.every((card) => card.left >= 0 && card.right <= mobile.viewport.width) &&
    mobile.metrics.scrollWidth <= mobile.metrics.innerWidth;
  const reducedValid = reduced.metrics.signalAnimation === "none";
  const noErrors = [desktop, mobile, reduced].every((result) => result.errors.length === 0);

  if (!desktopValid || !mobileValid || !reducedValid || !noErrors) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
