const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseUrl = (process.env.SITE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

const checks = [
  { path: "/proposalpilot", selector: ".proposal-page > section [data-cover-content]", viewport: { width: 1440, height: 900 } },
  { path: "/about", selector: ".company-problems__heading", viewport: { width: 1440, height: 900 } },
  { path: "/faq", selector: ".faq-list details", viewport: { width: 1060, height: 420 } },
  { path: "/faq", selector: ".faq-list details", viewport: { width: 390, height: 844 } },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const check of checks) {
    const page = await browser.newPage({ viewport: check.viewport });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseUrl}${check.path}`, { waitUntil: "networkidle" });

    const target = page.locator(check.selector).first();
    await target.evaluate((element) => {
      let top = 0;
      let current = element;
      while (current instanceof HTMLElement) {
        top += current.offsetTop;
        current = current.offsetParent;
      }
      window.scrollTo({ top: top - window.innerHeight * .72, behavior: "instant" });
    });
    await page.waitForTimeout(140);

    const entering = await target.evaluate((element) => ({
      visible: element.getAttribute("data-site-layer-visible"),
      opacity: Number.parseFloat(getComputedStyle(element).opacity),
      transform: getComputedStyle(element).transform,
      top: Math.round(element.getBoundingClientRect().top),
      bottom: Math.round(element.getBoundingClientRect().bottom),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    await page.waitForTimeout(900);
    const landed = await target.evaluate((element) => ({
      visible: element.getAttribute("data-site-layer-visible"),
      opacity: Number.parseFloat(getComputedStyle(element).opacity),
      transform: getComputedStyle(element).transform,
    }));
    const valid = entering.top < check.viewport.height
      && entering.bottom > 0
      && entering.opacity > 0
      && entering.opacity < 1
      && landed.visible === "true"
      && landed.opacity === 1
      && landed.transform === "none"
      && entering.scrollWidth <= entering.innerWidth
      && errors.length === 0;
    results.push({ ...check, entering, landed, errors, valid });
    await page.close();
  }

  const conceptPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const conceptErrors = [];
  conceptPage.on("console", (message) => {
    if (message.type() === "error") conceptErrors.push(message.text());
  });
  conceptPage.on("pageerror", (error) => conceptErrors.push(error.message));
  await conceptPage.goto(`${baseUrl}/proposalpilot`, { waitUntil: "networkidle" });
  const conceptFlow = conceptPage.locator("[aria-label='智小申规划工作链概念示意']");
  await conceptFlow.scrollIntoViewIfNeeded();
  await conceptPage.waitForTimeout(900);
  const conceptContent = await conceptFlow.locator("article").evaluateAll((articles) => articles.map((article) => {
    const heading = article.querySelector("h3");
    const paragraph = article.querySelector("p");
    const facts = Array.from(article.querySelectorAll("dd")).map((item) => item.textContent?.trim() || "");
    return {
      headingOpacity: heading ? getComputedStyle(heading).opacity : null,
      paragraphOpacity: paragraph ? getComputedStyle(paragraph).opacity : null,
      headingText: heading?.textContent?.trim() || "",
      paragraphText: paragraph?.textContent?.trim() || "",
      facts,
    };
  }));
  const activeStageBeforeHover = await conceptFlow.locator("article[data-active='true']").evaluate((stage) => ({
    index: Array.from(stage.parentElement?.children || []).indexOf(stage),
    background: getComputedStyle(stage).backgroundColor,
  }));
  await conceptFlow.hover();
  await conceptPage.waitForTimeout(3400);
  const activeStageAfterHover = await conceptFlow.locator("article[data-active='true']").evaluate((stage) =>
    Array.from(stage.parentElement?.children || []).indexOf(stage));
  const conceptValid = conceptContent.length === 8
    && conceptContent.every((item) => item.headingOpacity === "1"
      && item.paragraphOpacity === "1"
      && item.headingText.length > 0
      && item.paragraphText.length > 0
      && item.facts.length === 2
      && item.facts.every((fact) => fact.length > 0))
    && activeStageBeforeHover.background === "rgb(255, 255, 255)"
    && activeStageBeforeHover.index === activeStageAfterHover
    && conceptErrors.length === 0;
  if (process.env.CONCEPT_SCREENSHOT) {
    await conceptPage.screenshot({ path: process.env.CONCEPT_SCREENSHOT, fullPage: false });
  }
  results.push({
    path: "/proposalpilot",
    selector: "ProposalConceptFlow text",
    viewport: { width: 1440, height: 900 },
    conceptContent,
    activeStageBeforeHover,
    activeStageAfterHover,
    errors: conceptErrors,
    valid: conceptValid,
  });
  await conceptPage.close();

  const conceptMobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const conceptMobileErrors = [];
  conceptMobilePage.on("console", (message) => {
    if (message.type() === "error") conceptMobileErrors.push(message.text());
  });
  conceptMobilePage.on("pageerror", (error) => conceptMobileErrors.push(error.message));
  await conceptMobilePage.goto(`${baseUrl}/proposalpilot`, { waitUntil: "networkidle" });
  const mobileConceptFlow = conceptMobilePage.locator("[aria-label='智小申规划工作链概念示意']");
  await mobileConceptFlow.scrollIntoViewIfNeeded();
  await conceptMobilePage.waitForTimeout(900);
  const conceptMobile = await mobileConceptFlow.locator("article[data-active='true']").evaluate((stage) => {
    const bounds = stage.getBoundingClientRect();
    return {
      cardWidth: Math.round(bounds.width),
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headingOpacity: getComputedStyle(stage.querySelector("h3")).opacity,
      facts: stage.querySelectorAll("dd").length,
    };
  });
  const conceptMobileValid = conceptMobile.cardWidth < conceptMobile.viewportWidth
    && conceptMobile.scrollWidth <= conceptMobile.viewportWidth
    && conceptMobile.headingOpacity === "1"
    && conceptMobile.facts === 2
    && conceptMobileErrors.length === 0;
  results.push({
    path: "/proposalpilot",
    selector: "ProposalConceptFlow mobile card",
    viewport: { width: 390, height: 844 },
    conceptMobile,
    errors: conceptMobileErrors,
    valid: conceptMobileValid,
  });
  await conceptMobilePage.close();

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  if (results.some((result) => !result.valid)) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
