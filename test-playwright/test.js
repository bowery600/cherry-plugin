const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, 'test-faq.html');
  await page.goto(`file://${htmlPath}`);

  // Initial state checks
  const panel1Hidden = await page.evaluate(() => document.getElementById('panel1').hasAttribute('hidden'));
  const panel2Hidden = await page.evaluate(() => document.getElementById('panel2').hasAttribute('hidden'));
  console.log('Initial panel 1 hidden:', panel1Hidden); // false
  console.log('Initial panel 2 hidden:', panel2Hidden); // true

  // Click the second accordion trigger to open it
  await page.click('button:has-text("Q2")');

  // Verify immediate attribute changes
  const panel2HiddenImmediate = await page.evaluate(() => document.getElementById('panel2').hasAttribute('hidden'));
  console.log('Panel 2 hidden immediately after click:', panel2HiddenImmediate); // false

  // Verify timeout behavior on panel 1
  const panel1HiddenImmediate = await page.evaluate(() => document.getElementById('panel1').hasAttribute('hidden'));
  console.log('Panel 1 hidden immediately after click:', panel1HiddenImmediate); // false

  await page.waitForTimeout(450); // wait for setTimeout

  const panel1HiddenAfterTimeout = await page.evaluate(() => document.getElementById('panel1').hasAttribute('hidden'));
  console.log('Panel 1 hidden after timeout:', panel1HiddenAfterTimeout); // true

  await browser.close();
})();
