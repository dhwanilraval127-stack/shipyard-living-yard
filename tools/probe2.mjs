import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message.slice(0, 120)));
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__jernvik', { timeout: 30000 });
await page.click('#enter');
await new Promise((r) => setTimeout(r, 6000));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate('window.__jernvik.setShadows(false)');
const dump = async (tag) => {
  const d = await page.evaluate(`(() => {
    const api = window.__jernvik;
    return {
      tag: '${tag}',
      px: api.player.pos.x.toFixed(0), pz: api.player.pos.z.toFixed(0),
      focus: api.focusInfo().id,
      card: !document.getElementById('doccard').hidden,
      clip: !document.getElementById('clipboard').hidden,
      notice: !document.getElementById('noticeboard').hidden,
      twod: !document.getElementById('twod').hidden,
    };
  })()`);
  console.log(JSON.stringify(d));
};
// keel
await page.evaluate('window.__jernvik.place(-43.0, 21.0); window.__jernvik.lookAt(-42.6, 2.6, 20)');
await new Promise((r) => setTimeout(r, 1800));
await dump('at-keel');
await page.keyboard.press('KeyE');
await new Promise((r) => setTimeout(r, 700));
await dump('keel-card-open');
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 400));
await dump('after-esc');
// s4
await page.evaluate('window.__jernvik.place(-47.8, 36.2); window.__jernvik.lookAt(-45.2, 5.6, 37)');
await new Promise((r) => setTimeout(r, 1800));
await dump('at-s4');
await page.keyboard.press('KeyE');
await new Promise((r) => setTimeout(r, 700));
await dump('s4-card-open');
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 400));
await dump('after-esc2');
// elin
await page.evaluate('window.__jernvik.place(-127.0, 42.0); window.__jernvik.lookAt(-130.8, -0.1, 43.7)');
await new Promise((r) => setTimeout(r, 1800));
await dump('at-elin');
await browser.close();
