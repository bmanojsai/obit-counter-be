import { findContentBySelector, queryContentBySelector, scrapePageBySelector } from "./scrapeHelpers.js";
import { extractUsingAI } from "./aiHelpers.js";

export async function extractUniqueObitDateIdentifierUsingAI(page, obitListIdentifier){
  console.log("Entering extractUniqueObitDateIdentifierUsingAI function");
  const queriedContentByUser = await scrapePageBySelector(
    page,
    obitListIdentifier
  );

  const extractedData = await extractUsingAI(
    process.env.AI_PROMPT_OBIT_DATE_IDENTIFIER,
    queriedContentByUser.slice(0, 5000).trim(),
  );

  const extractedJSON = JSON.parse(extractedData);
  const selector = extractedJSON?.obitDateCSSSelector;

  // Verify the extracted selector
  const firstQueriedDateContentHandle = await findContentBySelector(
    page,
    selector
  );

  const firstQueriedDateContent = await firstQueriedDateContentHandle.innerText();

  if (
    !firstQueriedDateContent ||
    new Date(firstQueriedDateContent) == "Invalid Date"
  ) {
    throw new Error(
      "Obituary Date not found with the provided or extracted uniqueObitDateIdentifier or it is not in the correct format."
    );
  }

  console.log("Existing extractUniqueObitDateIdentifierUsingAI function");
  return selector;
}

export async function goToNextPage(page, nextPageIdentifier, nextPageAPIIdentifier) {
  console.log("Entering goToNextPage function");
  if (!page) {
    throw new Error('Page is not loaded. Please make sure to load the page first.');
  }

  const nextButtonHandles = await queryContentBySelector(page, nextPageIdentifier);
  const nextButton = nextButtonHandles[nextButtonHandles.length - 1];
  if (!nextButton) {
    console.log('Next button not found. Stopping pagination.');
    return false;
  }

  console.log('Navigating to the next page...');
  await nextButton.click();
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    nextPageAPIIdentifier && page.waitForResponse(response =>
      response.url().includes(nextPageAPIIdentifier) && response.status() === 200
    ),
    page.waitForTimeout(2000)
  ]);

  const currentUrl = page.url();
  console.log(`Current page URL after navigation: ${currentUrl}`);
  console.log("Exiting goToNextPage function");
  return true;
}

export async function getObituaryCountInRange(page,uniqueObitDateIdentifier, noOfDays, nextPageIdentifier) {
  console.log("Entering getObituaryCountInRange function");
  const currentDate = new Date();
  let count = 0;
  let allWithinRange = true;

  while (allWithinRange) {
    const {obitCount, allObitsWithinRange} = await getObituaryCountInRangeInPage(page, uniqueObitDateIdentifier, noOfDays, currentDate);

    count += obitCount;
    allWithinRange = allObitsWithinRange;

    console.log(`Obituaries within the last ${noOfDays} days on page:`, count);

    if (allWithinRange) {
      console.log("All obituaries are within the date range.");
      if(!await goToNextPage(page, nextPageIdentifier)) {
          console.log("No more pages to navigate.");
          break;
      }
    }else {
      console.log("Not all obituaries are within the date range.");
    }
  }

  console.log("Exiting getObituaryCountInRange function");
  return count;
}

export async function getObituaryCountInRangeInPage(page, uniqueObitDateIdentifier, noOfDays, currentDate){
  console.log("Entering getObituaryCountInRangeInPage function");
  const queriedDateContentHandles = await queryContentBySelector(
    page,
    uniqueObitDateIdentifier
  );

  if (
    !queriedDateContentHandles ||
    queriedDateContentHandles.length === 0
  ) {
    throw new Error("No obituaries found with death date in the page.");
  }

  let obitCount = 0;
  let allObitsWithinRange = true;

  for (const handle of queriedDateContentHandles) {
    const dateText = await handle.innerText();
    const obitDate = new Date(dateText);
    if (!obitDate || obitDate == "Invalid Date") {
        console.log("Either the date is not present or is in Invalid date format:", dateText);
      continue;
    }
    console.log("Obituary date:", obitDate);

    if(isDateWithinRange(obitDate, noOfDays, currentDate)){
      obitCount++;
      console.log("Obituary date is within range", obitCount);
    }else{
      allObitsWithinRange = false;
    }
  }

  console.log("Exiting getObituaryCountInRangeInPage function");
  return {obitCount, allObitsWithinRange};
}

export function isDateWithinRange(obitDate, noOfDays, currentDate = new Date()) {
  console.log("Entering isDateWithinRange function");
  
  const daysDifference = (currentDate - obitDate) / (1000 * 60 * 60 * 24);
  console.log("Days difference:", daysDifference);

  console.log("Exiting isDateWithinRange function");
  return daysDifference <= noOfDays;
}