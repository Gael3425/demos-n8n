const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('https://useautomatch.com/#join', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const dump = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return { error: 'no form' };
    const rows = [...form.querySelectorAll('label, input, textarea, select')].map(el => {
      if (el.tagName === 'SELECT') {
        return {
          tag: 'select',
          label: el.closest('label')?.innerText?.trim() || el.getAttribute('aria-label') || el.name || el.id,
          options: [...el.options].map(o => o.value + ' | ' + o.textContent.trim()),
        };
      }
      if (el.tagName === 'LABEL') return { tag: 'label', text: el.innerText.trim().slice(0, 120) };
      return {
        tag: el.tagName.toLowerCase(),
        type: el.type,
        id: el.id,
        name: el.name,
        placeholder: el.placeholder,
        label: el.closest('label')?.innerText?.trim().slice(0, 120),
      };
    });
    const btns = [...form.querySelectorAll('button, input[type=submit]')].map(b => ({
      text: b.innerText || b.value, type: b.type,
    }));
    return { rows, btns, action: form.action, method: form.method };
  });
  console.log(JSON.stringify(dump, null, 1));
  await browser.close();
})();
