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
await page.evaluate('window.__jernvik.setTime("17:10")');
const shots = [
  ['e1-overlook-view', 'window.__jernvik.place(-122, -121, 152)'],
  ['e2-gate-dawn', 'window.__jernvik.setTime("05:10"); window.__jernvik.place(178, -14, 95)'],
  ['e3-night-yard', 'window.__jernvik.setTime("23:20"); window.__jernvik.place(-14, 4, 100)'],
  ['e4-cut-night', 'window.__jernvik.setTime("23:40"); window.__jernvik.place(-108, 22, 210)'],
];
for (const [name, js] of shots) {
  await page.evaluate(js);
  await new Promise((r) => setTimeout(r, 3500));
  await page.screenshot({ path: `/home/user/shots/${name}.png` });
}
await browser.close();
console.log('diag2 done');
