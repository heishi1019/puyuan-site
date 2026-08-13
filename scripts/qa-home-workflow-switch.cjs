const { chromium } = require("playwright");

const url = process.env.HOME_BASE_URL || "http://127.0.0.1:3017/";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "compact", width: 1060, height: 420 },
  { name: "mobile", width: 390, height: 844 },
];

async function inspectViewport(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#workflow").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const initialText = await page
    .locator(".phase-two-workflow__node.is-current p")
    .textContent();
  const initialLabel = await page
    .locator("#workflow-stage-copy")
    .getAttribute("aria-labelledby");
  await page.locator("#workflow-tab-proposal").click();

  const samples = [];
  for (let elapsed = 0; elapsed <= 1440; elapsed += 40) {
    if (elapsed > 0) await page.waitForTimeout(40);
    samples.push(
      await page.evaluate((time) => {
        const panel = document.querySelector("#workflow-stage-copy");
        const copy = document.querySelector(
          ".phase-two-workflow__node.is-current p",
        );
        const stories = Array.from(
          document.querySelectorAll(".phase-two-workflow__story"),
        );
        return {
          time,
          phase: panel?.className.match(/is-copy-(\w+)/)?.[1] || null,
          busy: panel?.getAttribute("aria-busy"),
          label: panel?.getAttribute("aria-labelledby"),
          text: copy?.textContent?.trim() || "",
          opacity: copy ? Number(getComputedStyle(copy).opacity) : null,
          storyCount: stories.length,
          storyOpacity: stories.map((story) =>
            Number(getComputedStyle(story).opacity),
          ),
        };
      }, elapsed),
    );
    if (elapsed === 680) {
      await page.screenshot({
        path: `qa-home-workflow-switch-${viewport.name}.png`,
      });
    }
  }

  const finalState = await page.evaluate(() => ({
    selected: document
      .querySelector("#workflow-tab-proposal")
      ?.getAttribute("aria-selected"),
    busy: document
      .querySelector("#workflow-stage-copy")
      ?.getAttribute("aria-busy"),
    phase: document
      .querySelector("#workflow-stage-copy")
      ?.className.match(/is-copy-(\w+)/)?.[1],
    text: document
      .querySelector(".phase-two-workflow__node.is-current p")
      ?.textContent?.trim(),
    horizontalOverflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  }));

  await page.close();

  const changedAt = samples.find((sample) => sample.label !== initialLabel)?.time;
  const phases = [...new Set(samples.map((sample) => sample.phase))];
  const fullyBlankSamples = samples.filter(
    (sample) =>
      (sample.opacity === null || sample.opacity <= 0.01) &&
      (sample.storyOpacity.length === 0 ||
        sample.storyOpacity.every((opacity) => opacity <= 0.01)),
  );

  return {
    viewport,
    initialText,
    initialLabel,
    changedAt,
    phases,
    fullyBlankSamples: fullyBlankSamples.map((sample) => sample.time),
    finalState,
    errors,
  };
}

async function inspectReducedMotion(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#workflow").scrollIntoViewIfNeeded();
  await page.locator("#workflow-tab-proposal").click();
  const result = await page.evaluate(() => {
    const panel = document.querySelector("#workflow-stage-copy");
    return {
      selected: document
        .querySelector("#workflow-tab-proposal")
        ?.getAttribute("aria-selected"),
      busy: panel?.getAttribute("aria-busy"),
      phase: panel?.className.match(/is-copy-(\w+)/)?.[1],
      label: panel?.getAttribute("aria-labelledby"),
    };
  });
  await page.close();
  return result;
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  for (const viewport of viewports) {
    results.push(await inspectViewport(browser, viewport));
  }
  const reducedMotion = await inspectReducedMotion(browser);
  await browser.close();

  const failures = results.flatMap((result) => {
    const issues = [];
    if (!result.phases.includes("leaving")) issues.push("missing leaving phase");
    if (!result.phases.includes("entering")) issues.push("missing entering phase");
    if (result.changedAt === undefined || result.changedAt < 240) {
      issues.push("copy changed before the exit phase completed");
    }
    if (result.fullyBlankSamples.length > 0) {
      issues.push(`fully blank at ${result.fullyBlankSamples.join(", ")}ms`);
    }
    if (result.finalState.selected !== "true") issues.push("tab not selected");
    if (result.finalState.busy !== "false") issues.push("panel still busy");
    if (result.finalState.phase !== "idle") issues.push("panel not idle");
    if (result.finalState.horizontalOverflow) issues.push("horizontal overflow");
    if (result.errors.length > 0) issues.push("console errors");
    return issues.map((issue) => `${result.viewport.name}: ${issue}`);
  });

  if (
    reducedMotion.selected !== "true" ||
    reducedMotion.busy !== "false" ||
    reducedMotion.phase !== "idle" ||
    reducedMotion.label !== "workflow-tab-proposal"
  ) {
    failures.push("reduced motion: project switch was not immediate");
  }

  process.stdout.write(
    JSON.stringify({ results, reducedMotion, failures }, null, 2),
  );
  if (failures.length > 0) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
