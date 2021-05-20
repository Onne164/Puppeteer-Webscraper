'use strict';

const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');

(async function main() {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto('https://en.wikipedia.org/wiki/Image');

    const imgURLs = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('#mw-content-text img.thumbimage'),
        ({ src }) => src,
      )
    );
    console.log(imgURLs);
    await browser.close();

    imgURLs.forEach((imgURL, i) => {
      https.get(imgURL, (response) => {
        response.pipe(fs.createWriteStream(`${i++}.${imgURL.slice(-3)}`));
      });
    });
  } catch (err) {
    console.error(err);
  }
})();
