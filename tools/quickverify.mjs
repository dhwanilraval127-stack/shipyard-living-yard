import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.click('#enter');
await new Promise((r) => setTimeout(r, 9000));
await page.screenshot({ path: '/home/user/shots/01-arrival.png' });
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate('window.__jernvik.setShadows(false)');
const shots = [
  ['final-1-gate-noon', 'window.__jernvik.setTime("12:00"); window.__jernvik.place(150, -11, 90)'],
  ['final-2-shed-yard', 'window.__jernvik.place(30, -42, 15)'],
  ['final-3-hull44', 'window.__jernvik.place(-52, 38, 30)'],
  ['final-4-elin', 'window.__jernvik.place(-122, 26, 250)'],
  ['final-5-overlook-golden', 'window.__jernvik.setTime("17:10"); window.__jernvik.place(-125, -124, 175)'],
  ['final-6-night-quay', 'window.__jernvik.setTime("23:10"); window.__jernvik.place(60, 34, 150)'],
];
for (const [name, js] of shots) {
  await page.evaluate(js);
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: `/home/user/shots/${name}.png` });
}
console.log('errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
