const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const files = [
  {
    input: "public/logo-concepts/puyuan-logo-v2-board.svg",
    output: "public/logo-concepts/puyuan-logo-v2-board.png",
    width: 1600,
    height: 1000,
  },
  {
    input: "public/logo-concepts/puyuan-original-color-board.svg",
    output: "public/logo-concepts/puyuan-original-color-board.png",
    width: 1400,
    height: 820,
  },
];

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  for (const file of files) {
    const page = await browser.newPage({ viewport: { width: file.width, height: file.height } });
    await page.goto(pathToFileURL(path.resolve(file.input)).href, { waitUntil: "load" });
    await page.screenshot({ path: path.resolve(file.output), omitBackground: false });
    await page.close();
  }

  const faviconPage = await browser.newPage({ viewport: { width: 760, height: 260 } });
  const faviconSvg = fs.readFileSync(
    path.resolve("assets/logo-v2/puyuan-favicon.svg"),
    "utf8",
  );
  const faviconUrl = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString("base64")}`;
  await faviconPage.setContent(`
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #0a0a0a; color: #f5f5f2; font: 12px Arial, sans-serif; }
      main { display: flex; align-items: end; justify-content: center; gap: 56px; height: 260px; padding: 38px; }
      figure { display: grid; justify-items: center; gap: 18px; margin: 0; }
      img { display: block; image-rendering: auto; }
      figcaption { color: #9d9d97; letter-spacing: 2px; }
    </style>
    <main>
      ${[16, 24, 32, 64, 128].map((size) => `<figure><img src="${faviconUrl}" width="${size}" height="${size}"><figcaption>${size}px</figcaption></figure>`).join("")}
    </main>
  `);
  await faviconPage.waitForLoadState("load");
  await faviconPage.screenshot({
    path: path.resolve("public/logo-concepts/puyuan-favicon-v2-sizes.png"),
  });
  await faviconPage.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
