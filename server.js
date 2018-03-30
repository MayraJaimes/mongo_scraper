const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Front Index Page");
});

app.get("/all", function(req, res) {
  db.scrapedData.find({}, function(error, docs) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(docs);
    }
  });
});

app.get("/scrape", function(req, res) {
  var link = "https://www.sciencedaily.com/news/top/health/";
  request(link, function(error, response, html) {
    var $ = cheerio.load(html);
    $(".latest-head").each(function(i, element) {

      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      if (title && link) {
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(inserted);
          }
        });
      }
    });
  });
  res.send("Scrape Complete");
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});
