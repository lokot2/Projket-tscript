const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/');
  await page.$eval('#noteTitle', el => el.value = 'test@example.com');
  await page.$eval('#noteDescription', el => el.value = 'test@example.com');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.city-list-item');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();