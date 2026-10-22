import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.click('#enter');
await new Promise((r) => setTimeout(r, 5000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false); window.__jernvik.setTime("12:00")');
const shots = [
  ['d1-hull44-walkway', 'window.__jernvik.place(-56, 46, 100)'],
  ['d2-hull44-foot', 'window.__jernvik.place(-62, 16, 55)'],
  ['d3-ways-wide', 'window.__jernvik.place(-20, 0, 130)'],
  ['d4-elin-bow', 'window.__jernvik.place(-118, 14, 235)'],
];
for (const [name, js] of shots) {
  await page.evaluate(js);
  await new Promise((r) => setTimeout(r, 3200));
  await page.screenshot({ path: `/home/user/shots/${name}.png` });
}
await browser.close();
console.log('diag done');
