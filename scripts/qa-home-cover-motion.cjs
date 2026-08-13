const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseUrl = process.env.HOME_BASE_URL || "http://127.0.0.1:3000/";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const scrollSectionToRatio = async (browserPage, section, viewportRatio) => {
    await section.evaluate((element, ratio) => {
      let layoutTop = 0;
      let current = element;

      while (current instanceof HTMLElement) {
        layoutTop += current.offsetTop;
        current = current.offsetParent;
      }

      window.scrollTo({ top: layoutTop - window.innerHeight * ratio, behavior: "instant" });
    }, viewportRatio);
    await browserPage.waitForTimeout(120);
  };

  const sampleCover = async (selector, viewportRatio, browserPage = page) => {
    const section = browserPage.locator(selector);
    await scrollSectionToRatio(browserPage, section, viewportRatio);
    return section.evaluate((element) => {
      const content = element.querySelector("[data-cover-content]");
      return {
        motion: element.getAttribute("data-cover-motion") || "landed",
        progress: getComputedStyle(element).getPropertyValue("--cover-content-progress").trim(),
        x: getComputedStyle(element).getPropertyValue("--cover-content-x").trim(),
        contentOpacity: content ? getComputedStyle(content).opacity : null,
        contentTransform: content ? getComputedStyle(content).transform : null,
        sectionTop: Math.round(element.getBoundingClientRect().top),
        sectionBottom: Math.round(element.getBoundingClientRect().bottom),
        scrollY: Math.round(window.scrollY),
        scrollMax: Math.round(document.documentElement.scrollHeight - window.innerHeight),
      };
    });
  };

  const sampleLayerEntry = async (selector, viewportRatio, browserPage = page) => {
    const element = browserPage.locator(selector).first();
    await scrollSectionToRatio(browserPage, element, viewportRatio);
    return element.evaluate((target) => ({
      visible: target.getAttribute("data-home-layer-visible"),
      opacity: getComputedStyle(target).opacity,
      transform: getComputedStyle(target).transform,
      top: Math.round(target.getBoundingClientRect().top),
      bottom: Math.round(target.getBoundingClientRect().bottom),
    }));
  };

  const sampleFreshEntrance = async ({ selector, viewport, scrollToBottom = false }) => {
    const browserPage = await browser.newPage({ viewport });
    const browserErrors = [];
    browserPage.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    browserPage.on("pageerror", (error) => browserErrors.push(error.message));
    await browserPage.goto(baseUrl, { waitUntil: "networkidle" });

    const element = browserPage.locator(selector).first();
    if (scrollToBottom) {
      await browserPage.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
      await browserPage.waitForTimeout(120);
    } else {
      await scrollSectionToRatio(browserPage, element, .72);
    }

    const entering = await element.evaluate((target) => ({
      visible: target.getAttribute("data-home-layer-visible"),
      opacity: Number.parseFloat(getComputedStyle(target).opacity),
      transform: getComputedStyle(target).transform,
      top: Math.round(target.getBoundingClientRect().top),
      bottom: Math.round(target.getBoundingClientRect().bottom),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    await browserPage.waitForTimeout(900);
    const landed = await element.evaluate((target) => ({
      visible: target.getAttribute("data-home-layer-visible"),
      opacity: Number.parseFloat(getComputedStyle(target).opacity),
      transform: getComputedStyle(target).transform,
    }));
    await browserPage.close();

    return {
      entering,
      landed,
      errors: browserErrors,
      valid:
        entering.top < viewport.height
        && entering.bottom > 0
        && entering.opacity > 0
        && entering.opacity < 1
        && landed.visible === "true"
        && landed.opacity === 1
        && landed.transform === "none"
        && entering.scrollWidth <= entering.innerWidth
        && browserErrors.length === 0,
    };
  };

  const productEntry = await sampleCover(".phase-two-products", .9);
  const faqEntry = await sampleCover(".phase-two-faq", .75);
  const faqItemsEntry = await page.locator(".phase-two-faq details").evaluateAll((items) => items.map((item) => ({
    opacity: getComputedStyle(item).opacity,
    transform: getComputedStyle(item).transform,
  })));
  const firstFaqItem = page.locator(".phase-two-faq details").first();
  await scrollSectionToRatio(page, firstFaqItem, .78);
  const faqQuestionEntry = await firstFaqItem.evaluate((item) => ({
    opacity: getComputedStyle(item).opacity,
    transform: getComputedStyle(item).transform,
  }));
  await page.screenshot({ path: "qa-home-faq-side-entry.png" });

  const faqLanded = await sampleCover(".phase-two-faq", .38);
  await page.waitForTimeout(700);
  const faqItemsLanded = await page.locator(".phase-two-faq details").evaluateAll((items) => items.map((item) => ({
    opacity: getComputedStyle(item).opacity,
    transform: getComputedStyle(item).transform,
  })));
  const contactEntry = await sampleCover(".phase-two-contact", .9);
  const capabilityVisibleEntry = await sampleLayerEntry(".phase-one-capabilities__heading", .82);
  const productVisibleEntry = await sampleLayerEntry(".phase-two-products__heading", .82);
  const contactVisibleEntry = await sampleLayerEntry(".phase-two-contact__inner", .82);
  await page.waitForTimeout(900);
  const contactVisibleLanded = await page.locator(".phase-two-contact__inner").evaluate((target) => ({
    visible: target.getAttribute("data-home-layer-visible"),
    opacity: getComputedStyle(target).opacity,
    transform: getComputedStyle(target).transform,
  }));

  const layerLandedStates = {};
  for (const selector of [".phase-two-workflow", ".phase-two-products", ".phase-two-faq", ".phase-two-contact"]) {
    layerLandedStates[selector] = await sampleCover(selector, .38);
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  const mobileMetrics = await mobile.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  const mobileFaqEntry = await sampleCover(".phase-two-faq", .75, mobile);
  const mobileFaqLanded = await sampleCover(".phase-two-faq", .38, mobile);

  const visibleViewportEntrances = {
    desktop: await sampleFreshEntrance({
      selector: ".phase-one-capabilities__heading",
      viewport: { width: 1440, height: 900 },
    }),
    lowHeight: await sampleFreshEntrance({
      selector: ".phase-two-products__heading",
      viewport: { width: 1060, height: 420 },
    }),
    mobile: await sampleFreshEntrance({
      selector: ".phase-one-capabilities__heading",
      viewport: { width: 390, height: 844 },
    }),
    contact: await sampleFreshEntrance({
      selector: ".phase-two-contact__inner",
      viewport: { width: 1440, height: 900 },
      scrollToBottom: true,
    }),
  };

  console.log(JSON.stringify({ productEntry, faqEntry, faqItemsEntry, faqQuestionEntry, faqLanded, faqItemsLanded, contactEntry, capabilityVisibleEntry, productVisibleEntry, contactVisibleEntry, contactVisibleLanded, layerLandedStates, mobileMetrics, mobileFaqEntry, mobileFaqLanded, visibleViewportEntrances, errors }, null, 2));
  if (errors.length || Object.values(visibleViewportEntrances).some((result) => !result.valid)) {
    process.exitCode = 1;
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
