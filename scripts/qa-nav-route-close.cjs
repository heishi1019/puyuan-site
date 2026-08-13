const { chromium } = require(process.env.NAV_PLAYWRIGHT_MODULE);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const products = page.locator(".nav-products");
  await products.hover();
  await page.waitForTimeout(100);

  const desktop = {
    openedBefore: await products.getAttribute("data-open"),
  };

  await products.locator('a[href="/scholarpilot"]').click();
  await page.waitForURL("**/scholarpilot");
  await page.waitForTimeout(150);
  desktop.url = page.url();
  desktop.openedAfter = await products.getAttribute("data-open");
  desktop.menuVisibility = await page.locator(".nav-products__menu").evaluate(
    (element) => getComputedStyle(element).visibility,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".nav-mobile summary").click();
  const mobile = {
    openedBefore: await page.locator(".nav-mobile").getAttribute("open"),
  };

  await page.locator('.nav-mobile a[href="/proposalpilot"]').click();
  await page.waitForURL("**/proposalpilot");
  await page.waitForTimeout(150);
  mobile.url = page.url();
  mobile.openedAfter = await page.locator(".nav-mobile").getAttribute("open");

  console.log(JSON.stringify({ desktop, mobile, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
