/* Headless verification: loads the yard in Chromium (SwiftShader WebGL2),
   clocks in, walks the camera through the day, saves screenshots + console log. */
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs';

const OUT = process.env.SHOTS_DIR || '/home/user/shots';
const URL = process.env.YARD_URL || 'http://localhost:5173';

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: [
    '--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader',
    '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox',
    '--window-size=1280,720',
  ],
  defaultViewport: { width: 1280, height: 720 },
});

const page = await browser.newPage();
const errors = [];
const warns = [];
page.on('console', (m) => {
  const t = m.type();
  if (t === 'error') errors.push(m.text());
  else if (t === 'warning') warns.push(m.text());
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

console.log('loading', URL);
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
try {
  await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
  console.log('engine up');
} catch {
  console.log('ENGINE DID NOT START; errors so far:', errors.slice(0, 12));
}

const bootText = await page.evaluate(() => {
  const el = document.querySelector('#bootlist');
  return el ? el.innerText : '(no bootlist)';
});
console.log('--- boot checklist ---\n' + bootText);

// clock in
await page.click('#enter').catch(() => console.log('enter click failed'));
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: `${OUT}/01-arrival.png` });

// skip arrival, then tour
const tour = async (name, fn) => {
  try { await fn(); } catch (e) { console.log(`tour ${name} failed:`, e.message); }
  await new Promise((r) => setTimeout(r, 2600));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const s = await page.evaluate('window.__jernvik.stats()');
  console.log(name, JSON.stringify(s));
};

await page.keyboard.press('Escape'); // skip arrival
await new Promise((r) => setTimeout(r, 1500));

await tour('02-gate-noon', async () => {
  await page.evaluate('window.__jernvik.setTime("12:00"); window.__jernvik.place(150, -11, 90)');
});
await tour('03-ways', async () => {
  await page.evaluate('window.__jernvik.place(-14, 4, 110)');
});
await tour('04-hull44', async () => {
  await page.evaluate('window.__jernvik.place(-52, 38, 30)');
});
await tour('05-elin', async () => {
  await page.evaluate('window.__jernvik.place(-122, 26, 250)');
});
await tour('06-cut-beach', async () => {
  await page.evaluate('window.__jernvik.place(-130, 55, 200)');
});
await tour('07-overlook-golden', async () => {
  await page.evaluate('window.__jernvik.setTime("17:10"); window.__jernvik.place(-125, -124, 175)');
});
await tour('08-night-quay', async () => {
  await page.evaluate('window.__jernvik.setTime("23:10"); window.__jernvik.place(60, 34, 150)');
});
await tour('09-dawn-arrival-gate', async () => {
  await page.evaluate('window.__jernvik.setTime("05:20"); window.__jernvik.place(178, -14, 95)');
});
await tour('10-rain-ways', async () => {
  await page.evaluate('window.__jernvik.setTime("10:50"); window.__jernvik.place(-20, 20, 120)');
});

console.log('--- console errors ---');
console.log(errors.length ? errors.slice(0, 20).join('\n') : '(none)');
console.log('--- console warnings (first 6) ---');
console.log(warns.slice(0, 6).join('\n') || '(none)');

await browser.close();
fs.writeFileSync(`${OUT}/errors.txt`, errors.join('\n---\n'));
console.log('done');
