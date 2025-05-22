# Obit Count

## Overview

**Obit Count** is a Node.js application that automates the process of counting obituaries listed on funeral home websites within a specified date range. It leverages browser automation (via Playwright) and AI-based CSS selector extraction to handle complex web page structures.

## Features

- **Automated Web Scraping**: Uses Playwright to navigate and scrape web pages.
- **AI-Powered Selector Extraction**: Employs an AI model to identify CSS selectors for obituary dates.
- **Pagination Handling**: Supports navigating through multiple pages of obituaries.
- **Date Range Filtering**: Counts obituaries within a user-defined date range.

## Prerequisites

- Node.js (v16 or later)
- npm (Node Package Manager)
- Playwright dependencies (installed automatically)
- An AI model endpoint (configured in `.env`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd obit-count
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Set up the `.env` file**:

  - Create a `.env` file in the root directory.
  - Add the following environment variables:

    ```env
    AI_TYPE=ollama/gemini
    OLLAMA_API_ENDPOINT=
    OLLAMA_MODEL=llama3.1:8b
    GEMINI_MODEL=gemini-2.0-flash
    GEMINI_API_KEY=
    AI_PROMPT_OBIT_DATE_IDENTIFIER='<task> Be a HTML CSS Expert who can understand complex HTML files with knowledge about funeral obituaries and Extract CSS selectors of the HTML element in the given scraped funeral home obituaries listing web page data which can be used to query the death dates of the obituaries listed in that website.</task>
    <instructions>
    1. Analyse and Extract the CSS selector of the HTML element which displays the death date of the obituary listed in the website. If not found any selector in the web page content, set the value to null.
    2. Since the website contains multiple obituaries, each having the same UI structure, the CSS selector should be generic enough to match all the obituaries listed on the page.
    3. Sometimes both birthdate and deathdate of an obituary are listed in the websites. In those cases, generate the CSS selector of the date which is the most recent one among those.
    4. Obit death date elements are usually the span, p, etc. HTML elements and the death date can be any date format. Please use any CSS pseudo-classes if required to make the selector generic.
    5. Handling Invalid Input: Consider the input invalid if it is not a webpage content, lacks required details, is ambiguous or contradictory; return an empty structure in such cases.
    </instructions>
    <output_format> Provide the extracted information directly as a JSON object without any introductory text or comments. Use the following structure: {"obitDateCSSSelector" : (string or null)}
    </output_format>'
    ```

4. Start the application:
   ```bash
   npm start
   ```

## Usage

### API Endpoints

1. **Test Endpoint**
   - **URL**: `/test`
   - **Method**: `GET`
   - **Description**: Verifies if the server is running.

2. **Obituary Count**
   - **URL**: `/obituaries/count`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "url": "https://example.com/obituaries",
       "noOfDays": 10,
       "obitListIdentifier": "body",
       "uniqueObitDateIdentifier": null,
       "nextPageIdentifier": ".next-page"
     }
     ```
   - **Response**:
     ```json
     {
       "url": "https://example.com/obituaries",
       "noOfDays": 10,
       "obitListIdentifier": "body",
       "uniqueObitDateIdentifier": ".date",
       "nextPageIdentifier": ".next-page",
       "totalObituaries": 25
     }
     ```

## Development

### Folder Structure

- `helpers/`: Contains utility functions for browser automation, AI integration, and scraping.
- `routes/`: Defines API routes.
- `app.js`: Entry point of the application.

### Scripts

- Start the server:
  ```bash
  npm start
  ```

## Limitations for now

- The AI model may fail to extract selectors for non-standard or ambiguous web pages.
- Websites with infinite scrolling or non-standard pagination are not supported.
- Websites where the obituaries are not listed in descending order are not supported.
- Websites with pagination as infinite scroll or "load more" buttons are not supported.
- Websites that lack unique HTML elements for Death date are not supported.
- Websites without standard Death Date format are not supported.

## Enhancements

- Dont consider datetime while checking for death date in range. consider only date.
- conside for atleast 3 consecutive pages which are not in range before stopping. Seems mulitple websites are not rendering obits in descending order. This might resolve that issue.

## License

This project is licensed under the ISC License.