const express = require("express");
const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const exphbs  = require('express-handlebars');

var app = express();

var port = process.env.PORT || 3000;


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/saved', function (req, res) {
  res.render('saved');
});

app.get('/comment', function (req, res) {
  res.render('comment');
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
  res.send("Scraped");
});

app.get("/clearall", function(req, res) {
  db.scrapedData.remove({}, function(error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
      res.send(response);
    }
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
