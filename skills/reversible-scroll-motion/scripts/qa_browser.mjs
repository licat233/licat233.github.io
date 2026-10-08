#!/usr/bin/env node
/* Browser acceptance for the Skill's reusable example.
 * Optional dependency: install Puppeteer in an existing Node project, then run:
 *   node scripts/qa_browser.mjs http://127.0.0.1:17894/skills/reversible-scroll-motion/assets/example.html
 * No dependency is bundled with the Skill itself. */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  console.error("Missing Puppeteer. Install it as a local dev dependency in the host project (npm i -D puppeteer), or run the acceptance checklist manually.");
  process.exit(2);
}

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/qa_browser.mjs <http://localhost:PORT/example.html>");
  process.exit(2);
}

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN || undefined,
  args: ["--no-sandbox"]
});

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const results = [];

async function test(cfg) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("response", response => {
    if (response.status() >= 400) errors.push(response.status() + " " + response.url());
  });
  await page.setViewport({ width: cfg.w, height: cfg.h, isMobile: cfg.mobile ?? false, hasTouch: cfg.mobile ?? false });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: cfg.reduced ? "reduce" : "no-preference" }]);
  if (cfg.blockCDN) {
    await page.setRequestInterception(true);
    page.on("request", r => r.url().includes("cdn.jsdelivr.net") ? r.abort() : r.continue());
  }
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

  const original = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - innerWidth,
    footerPadding: getComputedStyle(document.querySelector("footer")).paddingBottom,
    scenes: window.ScrollTrigger?.getAll().filter(t => t.vars.scrub === true).length || 0
  }));

  let idle = null;
  let reverse = null;
  if (!cfg.reduced && !cfg.blockCDN) {
    const rowIndex = await page.evaluate(() => window.ScrollTrigger.getAll().findIndex(t => t.trigger.matches('[data-motion-scene="cards"]')));
    if (rowIndex < 0) errors.push("Missing card ScrollTrigger");
    else {
      await page.evaluate(i => {
        const t = window.ScrollTrigger.getAll()[i];
        window.scrollTo({ top: Math.round(t.start + (t.end - t.start) * .25), behavior: "instant" });
      }, rowIndex);
      await pause(140);
      const before = await page.evaluate(i => window.ScrollTrigger.getAll()[i].animation.progress(), rowIndex);
      await pause(1100);
      const finished = await page.evaluate(i => window.ScrollTrigger.getAll()[i].animation.progress(), rowIndex);
      await page.evaluate(() => window.scrollTo({ top: Math.max(0, window.scrollY - 130), behavior: "instant" }));
      await pause(150);
      const afterReverse = await page.evaluate(i => window.ScrollTrigger.getAll()[i].animation.progress(), rowIndex);
      idle = { before, finished };
      reverse = afterReverse;
      if (!(finished > .99 && before < .95)) errors.push("Idle completion did not finish a partial scene");
      if (!(afterReverse < finished)) errors.push("Scroll did not reverse from completed frame");
    }
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await pause(1100);
  }

  const bottom = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    body: document.body.offsetHeight,
    overflow: document.documentElement.scrollWidth - innerWidth,
    cardsVisible: [...document.querySelectorAll('[data-motion-scene="cards"] [data-motion-item]')]
      .every(e => getComputedStyle(e).visibility !== "hidden" && +getComputedStyle(e).opacity >= .99),
    principlesVisible: [...document.querySelectorAll('[data-motion-scene="principles"] [data-motion-item]')]
      .every(e => getComputedStyle(e).visibility !== "hidden" && +getComputedStyle(e).opacity >= .99),
    footerVisible: [...document.querySelectorAll('footer [data-motion-item]')]
      .every(e => getComputedStyle(e).visibility !== "hidden" && +getComputedStyle(e).opacity >= .99)
  }));
  if (original.overflow !== 0 || bottom.overflow !== 0) errors.push("Horizontal overflow");
  if (Math.abs(original.height - bottom.height) > 16) errors.push("Scroll height changed while animating");
  if (original.footerPadding !== "0px") errors.push("Artificial Footer padding");
  if (!bottom.cardsVisible || !bottom.principlesVisible || !bottom.footerVisible) errors.push("End-of-page content is invisible");
  if ((cfg.blockCDN || cfg.reduced) && original.scenes) errors.push("Should not create animated scenes without motion support");

  results.push({ cfg, original, idle, reverse, bottom, errors });
  await page.close();
}

try {
  await test({ w: 1440, h: 900 });
  await test({ w: 820, h: 1180 });
  await test({ w: 390, h: 844, mobile: true });
  await test({ w: 375, h: 667, mobile: true });
  await test({ w: 390, h: 844, mobile: true, reduced: true });
  await test({ w: 1440, h: 900, blockCDN: true });
} finally {
  await browser.close();
}

for (const result of results) {
  const msg = result.cfg.w + "x" + result.cfg.h +
    (result.cfg.reduced ? " reduced" : "") + (result.cfg.blockCDN ? " no-CDN" : "");
  console.log((result.errors.length ? "FAIL " : "PASS ") + msg,
    JSON.stringify({ scenes: result.original.scenes, idle: result.idle,
      reverse: result.reverse, bottom: result.bottom, errors: result.errors }));
}
process.exit(results.some(r => r.errors.length) ? 1 : 0);
