import { launch } from "puppeteer-core";
import { preview } from "vite";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const ROUTES = [
  "/", "/shop", "/categories", "/about", "/contact", "/terms",
  "/accessories", "/new-products", "/best-sellers", "/prices-drop",
  "/discounts", "/stores", "/help", "/secure-payment", "/sitemap",
];

const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
  "/snap/bin/chromium", "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
];

function findChrome() {
  return CHROME_PATHS.find(p => existsSync(p)) || "";
}

async function prerender() {
  const dist = resolve("dist");
  const defaultHtml = readFileSync(resolve(dist, "index.html"), "utf-8");

  const server = await preview({
    preview: { port: 4173, host: "127.0.0.1" },
  });

  const chromePath = findChrome();

  if (!chromePath) {
    console.log("Chrome not found — copying index.html for each route as fallback");
    for (const route of ROUTES) {
      const filePath = route === "/" ? `${dist}/index.html` : `${dist}${route}.html`;
      writeFileSync(filePath, defaultHtml);
      console.log(`  → ${filePath}`);
    }
    await server.close();
    return;
  }

  const browser = await launch({
    executablePath: chromePath,
    args: ["--no-sandbox", "--headless=new"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  for (const route of ROUTES) {
    const url = `http://localhost:4173${route}`;
    process.stdout.write(`Prerendering ${route} ... `);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForSelector("#root", { timeout: 5000 });
      await new Promise(r => setTimeout(r, 5000));
      const html = await page.content();

      const filePath = route === "/"
        ? resolve(dist, "index.html")
        : resolve(dist, `${route.slice(1)}.html`);

      writeFileSync(filePath, html);
      const size = (html.length / 1024).toFixed(1);
      console.log(`✓ ${size}KB`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      const filePath = route === "/"
        ? resolve(dist, "index.html")
        : resolve(dist, `${route.slice(1)}.html`);
      writeFileSync(filePath, defaultHtml);
    }
  }

  await browser.close();
  await server.close();
  console.log("Prerender complete!");
}

prerender().catch(console.error);
