import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.slice(0,120)));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.click('#enter');
await new Promise((r) => setTimeout(r, 5000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 800));
await page.evaluate('window.__jernvik.setShadows(false); window.__jernvik.setTime("12:00")');

// the elevation shot: from the harbor looking north at the whole yard
await page.evaluate('window.__jernvik.place(0, 80, 0); window.__jernvik.lookAt(0, 8, 0)');
await new Promise((r) => setTimeout(r, 3000));
await page.screenshot({ path: '/home/user/shots/z1-elevation.png' });

// process of elimination at the problem view
await page.evaluate('window.__jernvik.place(-52, 38, 30)');
await new Promise((r) => setTimeout(r, 2000));
for (const name of ['kirsten', 'hull44', 'crane', 'elin', 'props']) {
  await page.evaluate(`window.__jernvik.toggle('${name}')`);
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `/home/user/shots/z-hid-${name}.png` });
}
await browser.close();
console.log('hunt done');
