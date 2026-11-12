const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const targets = [
    ['automatch', 'https://useautomatch.com/'],
    ['beyond', 'https://community.n8n.io/t/hiring-founding-n8n-builders-for-us-small-business-client-work-freelance-remote/328131'],
  ];
  for (const [name, url] of targets) {
    try {
      const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3500);
      const data = await page.evaluate(() => {
        const forms = [...document.querySelectorAll('form')].map(f => ({
          action: f.getAttribute('action'),
          method: f.getAttribute('method'),
          fields: [...f.querySelectorAll('input,textarea,select')].map(i => ({
            tag: i.tagName.toLowerCase(),
            type: i.getAttribute('type'),
            name: i.getAttribute('name'),
            placeholder: i.getAttribute('placeholder'),
            required: i.required,
          })),
        }));
        const iframes = [...document.querySelectorAll('iframe')].map(f => f.src);
        const links = [...document.querySelectorAll('a[href]')]
          .map(a => ({ t: a.innerText.trim().slice(0, 60), h: a.href }))
          .filter(l => /join|apply|form|tally|typeform|airtable|notion|calendly|mailto/i.test(l.h + ' ' + l.t))
          .slice(0, 20);
        const text = document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 2500);
        return { title: document.title, forms, iframes, links, text };
      });
      console.log(`\n===== ${name} (${r.status()}) =====`);
      console.log('title:', data.title);
      console.log('forms:', JSON.stringify(data.forms));
      console.log('iframes:', JSON.stringify(data.iframes));
      console.log('links:', JSON.stringify(data.links, null, 1));
      console.log('texto:', data.text);
    } catch (e) {
      console.log(`\n===== ${name} ERROR: ${e.message}`);
    }
  }
  await browser.close();
})();
