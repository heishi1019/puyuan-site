const { chromium } = require("playwright");

const viewports = [
  { name: "desktop", width: 1820, height: 797 },
  { name: "compact", width: 1097, height: 525 },
  { name: "mobile", width: 244, height: 720 },
];

async function measure(page, viewport) {
  await page.goto("http://127.0.0.1:3000/proposalpilot", { waitUntil: "networkidle" });

  const setup = await page.evaluate(({ width }) => {
    const sheets = [...document.querySelectorAll(".gate-sheet")];
    const stack = document.querySelector(".gate-stack");
    const section = stack?.closest("section");
    const nextSection = section?.nextElementSibling;

    if (!stack || !nextSection || sheets.length !== 6) {
      throw new Error(`Unexpected gate stack DOM at ${width}px`);
    }

    const stackBox = stack.getBoundingClientRect();
    const stackEnd = scrollY + stackBox.bottom;
    const sampleStart = Math.max(0, stackEnd - innerHeight - 900);
    const sampleEnd = Math.min(document.documentElement.scrollHeight - innerHeight, stackEnd + 200);
    return {
      stackEnd,
      sampleStart,
      sampleEnd,
      documentWidth: document.documentElement.scrollWidth,
      stickyTop: width <= 767 ? null : width <= 1180 ? 88 : 96,
      sheetHeights: sheets.map((element) => Math.round(element.getBoundingClientRect().height)),
      sheetStyles: sheets.map((element) => {
        const style = getComputedStyle(element);
        return { height: style.height, minHeight: style.minHeight, transform: style.transform, animation: style.animationName };
      }),
    };
  }, viewport);

  const rows = [];
  for (let y = setup.sampleStart; y <= setup.sampleEnd; y += 40) {
    await page.evaluate((targetY) => scrollTo({ top: targetY, behavior: "instant" }), y);
    await page.waitForTimeout(32);
    rows.push(await page.evaluate(() => {
      const sheets = [...document.querySelectorAll(".gate-sheet")];
      const nextSection = document.querySelector(".gate-stack")?.closest("section")?.nextElementSibling;
      return {
        y: Math.round(scrollY),
        tops: sheets.map((element) => Math.round(element.getBoundingClientRect().top)),
        nextTop: Math.round(nextSection?.getBoundingClientRect().top ?? 0),
      };
    }));
  }

  const releases = setup.stickyTop === null
    ? []
    : Array.from({ length: 6 }, (_, index) => rows.find((row) => row.tops[index] < setup.stickyTop - 2)?.y ?? null);

  return {
    stackEnd: Math.round(setup.stackEnd),
    documentWidth: setup.documentWidth,
    stickyTop: setup.stickyTop,
    sheetHeights: setup.sheetHeights,
    releases,
    releaseSpread: releases.length > 0 && releases.every(Number.isFinite)
      ? Math.max(...releases) - Math.min(...releases)
      : null,
    rows: rows.filter((row, index) => {
      if (index === 0 || index === rows.length - 1) return true;
      const previous = rows[index - 1];
      return row.tops.some((top, sheetIndex) => top !== previous.tops[sheetIndex]);
    }),
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    results[viewport.name] = await measure(page, viewport);
    const release = results[viewport.name].releases[0];
    if (Number.isFinite(release)) {
      await page.evaluate((targetY) => scrollTo({ top: targetY, behavior: "instant" }), release - 160);
      await page.waitForTimeout(50);
      await page.screenshot({ path: `qa-proposal-handoff-${viewport.name}-before.png` });
      await page.evaluate((targetY) => scrollTo({ top: targetY, behavior: "instant" }), release + 40);
      await page.waitForTimeout(50);
      await page.screenshot({ path: `qa-proposal-handoff-${viewport.name}-after.png` });
    }
    await page.screenshot({
      path: `qa-proposal-handoff-${viewport.name}.png`,
      fullPage: false,
    });
    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
