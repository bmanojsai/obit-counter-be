import express from "express";
import {
  openNewBrowser,
  openNewPage,
  closeNewBrowser,
} from "../helpers/browserHelpers.js";
import {
  extractUniqueObitDateIdentifierUsingAI,
  getObituaryCountInRange,
} from "../helpers/obitCountHelpers.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Server is running!");
});

router.post("/obituaries/count", async (req, res) => {
  let {
    url,
    noOfDays = 10,
    obitListIdentifier = "body",
    uniqueObitDateIdentifier,
    nextPageIdentifier,
  } = req.body;

  let browser;
  let totalObituaries = 0;
  try {
    console.time("Total Time Taken");

    if (!url) throw new Error("URL is required");
    if (!nextPageIdentifier) throw new Error("Next page identifier is required");

    browser = await openNewBrowser();
    const page = await openNewPage(browser, url);

    uniqueObitDateIdentifier =
      uniqueObitDateIdentifier ??
      (await extractUniqueObitDateIdentifierUsingAI(page, obitListIdentifier));
    console.log("Unique Obit Identifier:", uniqueObitDateIdentifier);

    totalObituaries = await getObituaryCountInRange(
      page,
      uniqueObitDateIdentifier,
      noOfDays,
      nextPageIdentifier
    );
    console.log("Final obituary count within the date range:", totalObituaries);

    await closeNewBrowser(browser);

    console.timeEnd("Total Time Taken");

    res.json({
      url,
      noOfDays,
      obitListIdentifier,
      uniqueObitDateIdentifier,
      nextPageIdentifier,
      totalObituaries,
    });
  } catch (error) {
    console.error("Error:", error.message);
    await closeNewBrowser(browser);
    res.status(422).json({ error: error.message });
  }
});

export default router;