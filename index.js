// require fs and puppeteer
const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    try {
      // Initialize Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Specify comic issue page url
    await page.goto("https://comicpunch.net/readme/index.php?title=amazing-spider-man-2018&chapter=1");
    console.log("page has been loaded!");
    await page.waitForTimeout(1000);
    await page.click("button.button4");
    console.log("'Full Chapter' button has been clicked!"); 

    //  Convert the Nodelist of  10 images returned from the DOM into an array, then map each item and get the src attribute value, 
    //and store it in 'src' variable, which is therefore returned to be the value of 'issueSrcs' variable.
    const issueSrcs = await page.evaluate(() => {
        const srcs = Array.from(
          document.querySelectorAll(".comicpic")
        ).map((image) => image.getAttribute("src"));
        return srcs;
  });

  console.log("Page has been evaluated!");
  console.log(issueSrcs);

//take the screenshot and save it to an images folder
//    await page.setViewport({ width: 1024, height: 800 });
//    for (let i = 0; i < 10; i++) {
//      try{
//         issueSrcs[i];
//         await page.screenshot({
//           path: "./images/images.jpg",
//           type: "jpeg",
//           fullPage: true
//       });
//    }catch(e){
//      console.error(`Error in capturing site`);
//   }
// }

    // Persist data into data.json file
    fs.writeFileSync("./data/data.json", JSON.stringify(issueSrcs));
    console.log("File is created!");

    // End Puppeteer
    await browser.close();

    } catch (error) {
      console.log(error);
    }
  })();
