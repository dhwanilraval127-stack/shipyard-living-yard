import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 140)); });
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message.slice(0, 140)));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.click('#enter');
await new Promise((r) => setTimeout(r, 6000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false)');
await page.evaluate(`
  window.__jernvik.place(-127.0, 42.0);
  window.__jernvik.lookAt(-130.8, -0.1, 43.7);
`);
await new Promise((r) => setTimeout(r, 2500));
const probe = await page.evaluate(`(() => {
  const api = window.__jernvik;
  return {
    pos: { x: api.player.pos.x.toFixed(1), y: api.player.pos.y.toFixed(2), z: api.player.pos.z.toFixed(1) },
    yaw: api.player.yaw.toFixed(2),
    focus: api.focusInfo(),
    card: !document.getElementById('doccard').hidden,
    clip: !document.getElementById('clipboard').hidden,
    notice: !document.getElementById('noticeboard').hidden,
    twod: !document.getElementById('twod').hidden,
  };
})()`);
console.log(JSON.stringify(probe, null, 1));
console.log('console errors:', logs.length ? logs.slice(0, 5).join(' || ') : 'none');
await browser.close();
