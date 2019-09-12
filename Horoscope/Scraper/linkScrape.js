const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    var links = []
    for (var i = 1; i < 189; i++){
    console.log("page " + i);
    await page.goto(`https://www.vice.com/en_us/topic/horoscopes?page=` + i);
    await page.waitForSelector("a.grid__wrapper__card");

    var news = await page.evaluate(() => {
      var linkNodeList = document.querySelectorAll(`a.grid__wrapper__card`);
      var title = document.querySelectorAll(`h2.grid__wrapper__card__text__title`);
      // var scoreList = document.querySelectorAll(`span.score`);
      var titleLinkArray = [];
      for (var n = 0; n < linkNodeList.length; n++) {
        titleLinkArray[n] = {
          title: title[n].innerText.trim(),
          link: linkNodeList[n].getAttribute("href"),
        };
       
      }
      return titleLinkArray;
    });
    links = links.concat(news);
}
    // console.log(news);
    await browser.close();
    // Writing the news inside a json file
    fs.writeFile("links.json", JSON.stringify(links), function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();