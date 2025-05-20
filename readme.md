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

3. Set up the `.env` file:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     OLLAMA_API_ENDPOINT=
     OLLAMA_MODEL=
     AI_PROMPT_OBIT_DATE_IDENTIFIER=
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