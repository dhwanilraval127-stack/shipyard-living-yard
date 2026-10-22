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
await new Promise((r) => setTimeout(r, 5000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false)');

// golden overlook (arc check)
await page.evaluate('window.__jernvik.setTime("17:10"); window.__jernvik.place(-122, -121, 152)');
await new Promise((r) => setTimeout(r, 3500));
await page.screenshot({ path: '/home/user/shots/f1-overlook-golden.png' });

// THE LAUNCH: watch from the ways head
await page.evaluate('window.__jernvik.setTime("13:12"); window.__jernvik.place(-18, 14, 145)');
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: '/home/user/shots/f2-launch-before.png' });
await new Promise((r) => setTimeout(r, 4000));   // 13:15 arrives ~1s later; run lasts ~8s
await page.screenshot({ path: '/home/user/shots/f3-launch-run.png' });
await new Promise((r) => setTimeout(r, 5000));
await page.screenshot({ path: '/home/user/shots/f4-launch-afloat.png' });

// night cut
await page.evaluate('window.__jernvik.setTime("23:30"); window.__jernvik.place(-108, 22, 210)');
await new Promise((r) => setTimeout(r, 3500));
await page.screenshot({ path: '/home/user/shots/f5-cut-night.png' });

console.log('errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
