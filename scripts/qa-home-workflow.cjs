const { chromium } = require("playwright");

const url = process.env.HOME_BASE_URL || "http://127.0.0.1:3000/";
const desktopWidth = Number(process.env.HOME_DESKTOP_WIDTH || 1440);
const desktopHeight = Number(process.env.HOME_DESKTOP_HEIGHT || 900);
const workflowProgress = Number(process.env.HOME_WORKFLOW_PROGRESS || .55);

async function inspectDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: desktopWidth, height: desktopHeight } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#workflow").evaluate((section, progress) => {
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = Math.max(section.clientHeight - window.innerHeight, 0);
    window.scrollTo({ top: sectionTop + scrollDistance * progress, behavior: "instant" });
  }, workflowProgress);
  await page.waitForTimeout(360);
  await page.waitForTimeout(2800);
  await page.evaluate(() => {
    const tab = document.querySelector('#workflow-tab-scholar');
    if (tab instanceof HTMLButtonElement) tab.click();
  });
  await page.waitForTimeout(350);
  const result = await page.evaluate(() => {
    const section = document.querySelector("#workflow");
    const sticky = document.querySelector(".phase-two-workflow__sticky");
    const inner = document.querySelector(".phase-two-workflow__inner");
    const frame = document.querySelector(".phase-two-workflow__frame");
    const active = document.querySelectorAll(".phase-two-workflow__node.is-active");
    const line = document.querySelector(".phase-two-workflow__line");
    const marker = document.querySelector(".phase-two-workflow__marker");
    const lineRect = line?.getBoundingClientRect();
    const markerRect = marker?.getBoundingClientRect();
    return {
      stage: sticky?.getAttribute("data-workflow-stage"),
      activeNodes: active.length,
      stickyPosition: sticky ? getComputedStyle(sticky).position : null,
      stickyTop: sticky ? getComputedStyle(sticky).top : null,
      sectionHeight: section?.getBoundingClientRect().height,
      sectionOffsetTop: section?.offsetTop,
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      scrollY: window.scrollY,
      sectionTop: section?.getBoundingClientRect().top,
      innerRect: inner?.getBoundingClientRect().toJSON(),
      stickyRect: sticky?.getBoundingClientRect().toJSON(),
      frameRect: frame?.getBoundingClientRect().toJSON(),
      stickyOpacity: sticky ? getComputedStyle(sticky).opacity : null,
      stickyVisibility: sticky ? getComputedStyle(sticky).visibility : null,
      stickyTransform: sticky ? getComputedStyle(sticky).transform : null,
      innerTransform: inner ? getComputedStyle(inner).transform : null,
      sectionOverflow: section ? getComputedStyle(section).overflow : null,
      sectionTransform: section ? getComputedStyle(section).transform : null,
      sectionContain: section ? getComputedStyle(section).contain : null,
      coverMotion: section?.getAttribute("data-cover-motion"),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scholarCopy: document.querySelector(".phase-two-workflow__node p")?.textContent,
      storyPhase: document.querySelector(".phase-two-workflow__story-phase h3")?.textContent,
      storyInput: document.querySelector(".phase-two-workflow__story-input p")?.textContent,
      storyAction: document.querySelector(".phase-two-workflow__story-action p")?.textContent,
      storyOutput: document.querySelector(".phase-two-workflow__story-output strong")?.textContent,
      railCenterDelta: lineRect && markerRect
        ? Math.abs(lineRect.top - (markerRect.top + markerRect.height / 2))
        : null,
    };
  });
  await page.screenshot({ path: "qa-home-workflow-desktop.png" });
  await page.close();
  return { result, errors };
}

async function inspectMobile(browser) {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(url, { waitUntil: "networkidle" });
  const target = page.locator('[data-workflow-node="2"]');
  await target.evaluate((node) => {
    const top = window.scrollY + node.getBoundingClientRect().top - window.innerHeight * 0.4;
    window.scrollTo({ top, behavior: "instant" });
  });
  await page.waitForTimeout(1000);
  const result = await page.evaluate(() => {
    const section = document.querySelector("#workflow");
    const sticky = document.querySelector(".phase-two-workflow__sticky");
    const track = document.querySelector(".phase-two-workflow__track");
    return {
      stage: sticky?.getAttribute("data-workflow-stage"),
      stickyPosition: sticky ? getComputedStyle(sticky).position : null,
      sectionHeight: section?.getBoundingClientRect().height,
      trackColumns: track ? getComputedStyle(track).gridTemplateColumns : null,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  await page.screenshot({ path: "qa-home-workflow-mobile.png" });
  await page.close();
  return { result, errors };
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const desktop = await inspectDesktop(browser);
  const mobile = await inspectMobile(browser);
  await browser.close();
  process.stdout.write(JSON.stringify({ desktop, mobile }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
