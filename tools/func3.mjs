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
await new Promise((r) => setTimeout(r, 6000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false)');

// no-ctx robustness: reload WITHOUT clock-in, make sure the sim survives work sounds
await page.evaluate('localStorage.clear(); location.reload()');
await new Promise((r) => setTimeout(r, 12000));
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
const noCtx = await page.evaluate(`({ up: !!window.__jernvik, fps: window.__jernvik.stats().fps })`);
console.log('NO-CTX BOOT:', JSON.stringify(noCtx));

// clock in for the connection run
await page.click('#enter');
await new Promise((r) => setTimeout(r, 5000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 800));
await page.evaluate('window.__jernvik.setShadows(false)');

// full thread: keel -> hero -> elin
const rub = async (where, look, want) => {
  await page.evaluate(`window.__jernvik.place(${where}); window.__jernvik.lookAt(${look})`);
  await new Promise((r) => setTimeout(r, 1800));
  const f = await page.evaluate('window.__jernvik.focusInfo()');
  console.log('focus:', f.id, '| want:', want, f.id === want ? 'OK' : 'MISMATCH');
  await page.keyboard.press('KeyE');
  await new Promise((r) => setTimeout(r, 800));
};
await rub('-43.0, 21.0', '-42.6, 2.6, 20', 'stamp:h44-keel');
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
await rub('-47.8, 36.2', '-45.2, 5.6, 37', 'stamp:h44-s4');
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
await rub('-127.0, 42.0', '-130.8, -0.1, 43.7', 'stamp:elin-b');
await new Promise((r) => setTimeout(r, 7000)); // held breath + far horn
const stored = JSON.parse(await page.evaluate(`localStorage.getItem('jernvik.v1')`));
console.log('RECORDS:', JSON.stringify(stored.narrative.records), 'CONNECTED:', stored.narrative.connected);
await page.screenshot({ path: '/home/user/shots/h2-connection-caption.png' });
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
await page.keyboard.press('Tab');
await new Promise((r) => setTimeout(r, 800));
console.log('NOTE:', await page.evaluate(`document.getElementById('cb__note').hidden ? 'hidden' : document.getElementById('cb__note').textContent`));
await page.screenshot({ path: '/home/user/shots/h3-clipboard.png' });
console.log('errors:', errors.length ? errors.slice(0,4).join(' | ') : 'none');
await browser.close();
console.log('func3 done');
