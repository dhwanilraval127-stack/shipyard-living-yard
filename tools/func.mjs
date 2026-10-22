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
await new Promise((r) => setTimeout(r, 1200));
await page.evaluate('window.__jernvik.setShadows(false)');

// 1) H44 stamp
await page.evaluate(`
  window.__jernvik.place(-49.0, 35.0);
  window.__jernvik.lookAt(-45.2, 5.6, 37);
`);
await new Promise((r) => setTimeout(r, 2000));
console.log('PROMPT1:', await page.evaluate(`document.getElementById('prompt').hidden ? 'HIDDEN' : document.getElementById('promptlabel').textContent`));
await page.keyboard.press('KeyE');
await new Promise((r) => setTimeout(r, 1000));
console.log('CARD1:', await page.evaluate(`document.getElementById('doccard').hidden ? 'CLOSED' : document.getElementById('doccard__title').textContent + ' / ' + document.getElementById('doccard__ref').textContent`));
await page.screenshot({ path: '/home/user/shots/g1-doccard.png' });
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 500));

// 2) ELIN stamp (low on her plate, near the waterline)
await page.evaluate(`
  window.__jernvik.place(-127.0, 42.0);
  window.__jernvik.lookAt(-130.8, -0.1, 43.7);
`);
await new Promise((r) => setTimeout(r, 2000));
console.log('PROMPT2:', await page.evaluate(`document.getElementById('prompt').hidden ? 'HIDDEN' : document.getElementById('promptlabel').textContent`));
await page.keyboard.press('KeyE');
await new Promise((r) => setTimeout(r, 1000));
console.log('CARD2:', await page.evaluate(`document.getElementById('doccard').hidden ? 'CLOSED' : document.getElementById('doccard__title').textContent`));

// 3) connection fires (caption + far horn)
await new Promise((r) => setTimeout(r, 7000));
const stored = JSON.parse(await page.evaluate(`localStorage.getItem('jernvik.v1')`));
console.log('RECORDS:', JSON.stringify(stored.narrative.records), 'CONNECTED:', stored.narrative.connected);
await page.screenshot({ path: '/home/user/shots/g2-connection.png' });

// 4) clipboard shows the thread
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 400));
await page.keyboard.press('Tab');
await new Promise((r) => setTimeout(r, 900));
console.log('CLIPBOARD:', JSON.stringify(await page.evaluate(`document.getElementById('cb__records').innerText.replace(/\\n/g, ' | ').slice(0, 220)`)));
await page.screenshot({ path: '/home/user/shots/g3-clipboard.png' });
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 400));

// 5) noticeboard + 2D copy
await page.keyboard.press('KeyN');
await new Promise((r) => setTimeout(r, 700));
console.log('NOTICE:', await page.evaluate(`document.getElementById('noticeboard').hidden ? 'CLOSED' : 'OPEN'`));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
await page.evaluate(`document.getElementById('set-twod').click()`);
await new Promise((r) => setTimeout(r, 700));
console.log('TWOD:', await page.evaluate(`document.getElementById('twod').hidden ? 'CLOSED' : 'OPEN'`));

console.log('errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
console.log('func done');
