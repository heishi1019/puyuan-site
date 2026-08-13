const { chromium } = require("playwright");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const source = path.join(
    __dirname,
    "..",
    "public",
    "logo-concepts",
    "puyuan-original-refined-preview.svg",
  );
  const output = path.join(
    __dirname,
    "..",
    "public",
    "logo-concepts",
    "puyuan-original-refined-preview.png",
  );
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
  await page.screenshot({ path: output });
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
