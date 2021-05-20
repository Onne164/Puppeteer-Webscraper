// require puppeteer, https and fs
const puppeteer = require("puppeteer");
const https = require('https');
const fs = require("fs");

(async () => {
  try {
    // Initialize Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Specify comic issue page url
    await page.goto(
      "https://comicpunch.net/readme/index.php?title=amazing-spider-man-2018&chapter=1"
    );
    console.log("Page has been loaded!");

    await page.click("button.button4");
    
    console.log("'Full Chapter' button has been clicked!");

    /*  Convert the Nodelist of images returned from the DOM into an array, then map each item and get the src attribute value,
    and store it in 'src' variable, which is therefore returned to be the value of 'imgURLs' variable.*/
    const imgURLs = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll(".comicpic")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });

    console.log("Page has been evaluated!");
    //console.log(imgURLs);

    // Persist data into data.json file
    fs.writeFileSync("./data/data.json", JSON.stringify(imgURLs));
    console.log("File is created!");

    // End Puppeteer
    await browser.close();
    
    // images download to the images folder
    imgURLs.forEach((imgURL, i) => {
      https.get(imgURL, (response) => {
        response.pipe(fs.createWriteStream('images/'+ `${i++}.${imgURL.slice(-3)}`));
      });
    });
  } catch (error) {
    console.log(error);
  }
  console.log("Download complete, check the images folder");
})();
