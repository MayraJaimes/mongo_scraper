const request = require("request");
const router = require("express").Router();
const cheerio = require("cheerio");

const Article = require("../models/Article");
const Note = require("../models/Note");
const asyncForEach = require("../helpers/asyncForEach");

router.get("/", function(req, res) {  
  request("https://www.sciencedaily.com/news/top/health/", function(error, response, html) {
    var $ = cheerio.load(html);
    const startScraping = async () => {
      await asyncForEach($(".latest-head"), async (element) => {
        var article = $(element).children("a").text();
        var link = "https://www.sciencedaily.com" + $(element).children("a").attr("href");
        var summary = $(element).next().clone().children().remove().end().text();
        if (article && link && summary) {
          let articles = await Article.find({title: article})
          let newArticle; 
          if (articles.length === 0) {
            newArticle = await Article.create({
              title: article,
              link: link,
              saved: false,
              summary: summary
            });
          }
        }
      });
      res.redirect('/')
    };
    startScraping();
  })
});

module.exports = router;