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
page.on('pageerror', (e) => errors.push(e.message.slice(0, 100)));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.evaluate('localStorage.clear()');
await page.click('#enter');
await new Promise((r) => setTimeout(r, 6000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false)');

// rub all three stamps
for (const [where, look] of [
  ['-43.0, 21.0', '-42.6, 2.6, 20'],
  ['-47.8, 36.2', '-45.2, 5.6, 37'],
  ['-127.0, 42.0', '-130.8, -0.1, 43.7'],
]) {
  await page.evaluate(`window.__jernvik.place(${where}); window.__jernvik.lookAt(${look})`);
  await new Promise((r) => setTimeout(r, 1800));
  await page.keyboard.press('KeyE');
  await new Promise((r) => setTimeout(r, 700));
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
}
await new Promise((r) => setTimeout(r, 7000)); // the held breath + far horn
const stored = JSON.parse(await page.evaluate(`localStorage.getItem('jernvik.v1')`));
console.log('RECORDS:', JSON.stringify(stored.narrative.records));
console.log('CONNECTED:', stored.narrative.connected);
// WO-03 should have logged (all 3 rubs + connected)
console.log('ORDERS:', JSON.stringify(stored.narrative.orders));
// spawn-walk regression: hold W for 3s, player must have moved west
const p0 = await page.evaluate('({x: window.__jernvik.player.pos.x, z: window.__jernvik.player.pos.z})');
await page.keyboard.down('KeyW');
await new Promise((r) => setTimeout(r, 3000));
await page.keyboard.up('KeyW');
const p1 = await page.evaluate('({x: window.__jernvik.player.pos.x, z: window.__jernvik.player.pos.z})');
console.log('SPAWN WALK:', JSON.stringify(p0), '->', JSON.stringify(p1), (p0.x - p1.x) > 3 ? 'OK' : 'STUCK!');
await page.keyboard.press('Tab');
await new Promise((r) => setTimeout(r, 800));
console.log('NOTE:', await page.evaluate(`document.getElementById('cb__note').hidden ? 'hidden' : document.getElementById('cb__note').textContent`));
await page.screenshot({ path: '/home/user/shots/h3-clipboard.png' });
console.log('errors:', errors.length ? errors.slice(0, 3).join(' | ') : 'none');
await browser.close();
console.log('func4 done');
