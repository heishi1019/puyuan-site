const { chromium } = require("playwright");

const url = process.env.HOME_BASE_URL || "http://127.0.0.1:3017/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(url, { waitUntil: "networkidle" });
  const grid = page.locator(".phase-two-products__grid");
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const card = page.locator("#product-scholar");
  const bounds = await card.boundingBox();
  if (!bounds) throw new Error("Product card was not measurable");

  const positions = [
    { name: "top", x: bounds.x + bounds.width * .55, y: bounds.y + 18 },
    { name: "left", x: bounds.x + 16, y: bounds.y + bounds.height * .56 },
    { name: "seam", x: bounds.x + bounds.width - 14, y: bounds.y + bounds.height * .62 },
  ];
  const samples = [];

  for (const position of positions) {
    await page.mouse.move(position.x, position.y, { steps: 8 });
    await page.waitForTimeout(180);
    samples.push(await card.evaluate((element, name) => ({
      name,
      edgeX: element.style.getPropertyValue("--matrix-edge-x"),
      edgeY: element.style.getPropertyValue("--matrix-edge-y"),
      edgeOpacity: Number(element.style.getPropertyValue("--matrix-edge-opacity")),
      borderColor: getComputedStyle(element.parentElement).borderColor,
    }), position.name));
    await page.screenshot({ path: `qa-home-product-proximity-${position.name}.png` });
  }

  const horizontalOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await browser.close();

  const failures = [];
  if (!samples[0].edgeY.startsWith("0px")) failures.push("top edge did not lock to y=0");
  if (!samples[1].edgeX.startsWith("0px")) failures.push("left edge did not lock to x=0");
  if (Number.parseFloat(samples[2].edgeX) < bounds.width - 1) failures.push("seam edge did not lock to card width");
  if (samples.some((sample) => sample.edgeOpacity < .22)) failures.push("edge glow dropped below persistent floor");
  if (horizontalOverflow) failures.push("horizontal overflow");
  if (errors.length > 0) failures.push("console errors");

  process.stdout.write(JSON.stringify({ samples, horizontalOverflow, errors, failures }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
