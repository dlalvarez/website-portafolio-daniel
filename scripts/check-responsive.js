// Regresión de responsive: sin scroll horizontal, sin elementos fuera de pantalla y visor usable
// en 13 tamaños (móvil, tablet, horizontal, escritorio, ultra-ancho). Uso: npm run check:responsive
// Requiere Playwright instalado en tu máquina (no es dependencia del sitio): npx playwright install chromium
const { chromium } = require('playwright');
const server = require('../server.js');
const SIZES = [[320,568],[360,740],[390,844],[430,932],[568,320],[667,375],[932,430],[768,1024],[820,1180],[1024,768],[1366,768],[1920,1080],[2560,1300]];
(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch();
  let fails = 0;
  for (const [w, h] of SIZES) {
    const touch = w < 1000 || h < 500;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const p = await ctx.newPage();
    await p.goto(base); await p.waitForTimeout(1800);
    await p.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth, bad = [];
      document.querySelectorAll('body *').forEach(e => {
        if (getComputedStyle(e).position === 'fixed' || e.closest('.nav:not(.open),.lightbox,.peek,.sub,svg') || e.classList.contains('hp')) return;
        const b = e.getBoundingClientRect();
        if (b.width && (b.right > vw + 1 || b.left < -1)) bad.push(e.tagName + '.' + e.className);
      });
      return { overflow: document.documentElement.scrollWidth > vw, bad: bad.slice(0, 5) };
    });
    await p.evaluate(() => document.querySelector('.card').click()); await p.waitForTimeout(1600);
    const lb = await p.evaluate(() => {
      const a = document.querySelector('[data-lb-art]').getBoundingClientRect();
      const c = document.querySelector('.lb-close').getBoundingClientRect(), n = document.querySelector('.lb-nav.next').getBoundingClientRect();
      return { artH: Math.round(a.height), artOk: a.top >= 0 && a.bottom <= innerHeight + 1, ctrlOk: c.right <= innerWidth && n.right <= innerWidth && n.bottom <= innerHeight };
    });
    const ok = !r.overflow && !r.bad.length && lb.artOk && lb.ctrlOk && lb.artH >= 150;
    if (!ok) fails++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${w}x${h}`, ok ? `visor ${lb.artH}px` : JSON.stringify({ ...r, ...lb }));
    await ctx.close();
  }
  await browser.close(); server.close();
  process.exit(fails ? 1 : 0);
})();
