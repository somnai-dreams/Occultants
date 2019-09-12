const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");
const links = require("./links.json");
const url = "https://www.vice.com";
const start = 1714;
const end = links.length;



(async () => {
 


  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    var articles = "";
    // enter url in page

    for (var n = start; n < end; n++){
      var link = links[n].link;
      var title = links[n].title;
      if ((/^(Daily Horoscope).*$/g).test(title)){
    await page.goto(url + link);
    await page.waitForSelector("div.article__body");

    var news = await page.evaluate(() => {
      var content = document.querySelector(`div.article__body`).innerHTML;
      // var scoreList = document.querySelectorAll(`span.score`);
      // var titleLinkArray = [];
      // for (var n = 0; n < linkNodeList.length; n++) {
      //   titleLinkArray[n] = {
      //     title: title[n].innerText.trim(),
      //     link: linkNodeList[n].getAttribute("href"),
      //   };
       
      // }
      var fixed = content.replace(/<(?:br|\/h2|\/p)>/g, "\n")
           .replace(/<.*?>/g, "")
           .replace(/\((.*)\)/g, "");
           var horo = fixed.match(/(((Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)+[\ ]\n.*)|((Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)+\n.*))/gm).toString();
   return horo.replace(/[,](?! )/gm, "\n");


    });
    console.log(n + " of " + links.length);
   articles = articles.concat(news);
 }
}
    // console.log(news);
    await browser.close();
    // Writing the news inside a json file
    fs.writeFile("content3.txt", articles, function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
     fs.writeFile("content3.txt", articles, function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }

})();

