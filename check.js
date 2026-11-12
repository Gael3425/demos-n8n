const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const url = 'https://gael3425.github.io/demos-n8n/';

  for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
    page.on('console', m => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
    page.on('pageerror', e => errors.push(`${name}: pageerror ${e.message}`));
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    console.log(`${name}: status ${resp.status()}`);
    const info = await page.evaluate(() => {
      const vids = [...document.querySelectorAll('video')].map(v => ({
        src: v.currentSrc.split('/').pop(),
        ready: v.readyState,
        w: v.videoWidth,
        h: v.videoHeight,
        dur: Math.round(v.duration),
      }));
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      return { title: document.title, vids, overflow, h1: document.querySelector('h1')?.innerText.slice(0, 80) };
    });
    console.log(JSON.stringify(info));
    await page.screenshot({ path: `shot-${name}.png`, fullPage: name === 'desktop' });
    await page.close();
  }

  // comprobar que el video arranca de verdad (seek + play)
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const played = await page.evaluate(async () => {
    const v = document.querySelector('video');
    v.muted = true;
    try { await v.play(); } catch (e) { return 'play error: ' + e.message; }
    await new Promise(r => setTimeout(r, 2500));
    return { t: v.currentTime.toFixed(1), paused: v.paused, w: v.videoWidth };
  });
  console.log('reproduccion:', JSON.stringify(played));
  await browser.close();
  console.log('errores consola:', errors.length ? errors.join(' | ') : 'ninguno');
})();
