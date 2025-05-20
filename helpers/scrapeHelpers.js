export async function scrapePageBySelector(page, selector) {
    if (!page) {
      throw new Error('Page is not loaded. Please open the browser and load a URL first.');
    }
  
    return await page.locator(selector).nth(0).innerHTML();
  }
  
  export async function queryContentBySelector(page, selector) {
    if (!page) {
      throw new Error('Page is not loaded. Please make sure to load the page first.');
    }
  
    return await page.$$(selector);
  }
  
  export async function findContentBySelector(page, selector) {
    if (!page) {
      throw new Error('page is not loaded. Please make sure to load the page first.');
    }
  
    return await page.$(selector);
  }