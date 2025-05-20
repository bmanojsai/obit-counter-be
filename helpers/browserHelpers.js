import { chromium } from "playwright";

export async function openNewBrowser(headless = true) {
  console.log('Opening new browser...');
  const browser = await chromium.launch({ headless });
  console.log('Browser is running. Press Ctrl+C to stop.');

  return browser;
}

export async function openNewPage(browser, url) {
  if (!browser) {
    throw new Error('Browser is not opened. Please open the browser first.');
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);
  console.log(`New page opened: ${url}`);
  return page;
}

export async function closeNewBrowser(browser) {
  if (browser) {
    console.log('Closing browser...');
    await browser.close();
    browser = null;
    console.log('Browser closed.');
  }
}