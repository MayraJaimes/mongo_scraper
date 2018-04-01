const express = require("express"),
      mongojs = require("mongojs"),
      request = require("request"),
      cheerio = require("cheerio"),
      bodyParser = require("body-parser"),
      exphbs  = require('express-handlebars'),
      mongoose = require('mongoose'),
      app = express();

var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoScraper");

var scraperSchema = new mongoose.Schema({
  title: String,
  summary: String,
  link: String,
  comment: String,
  saved: Boolean
});

var Scraper = mongoose.model("Scraper", scraperSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/all", function(req, res) {
  Scraper.find({}, function(error, docs) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(docs);
    }
  });
});

// app.get("/saved", function(req, res) {
//   db.scrapedData.find({}, function(error, docs) {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       res.json(docs);
//     }
//   });
// });

// app.get('/comment', function (req, res) {
//   res.render('comment');
// });

// app.post('/comment', function (req, res) {
//   var username = req.body.username;
//   var comment = req.body.comment;
//   res.redirect("home")
// });

app.get("/scrape", function(req, res) {
  var link = "https://www.sciencedaily.com/news/top/health/";
  request(link, function(error, response, html) {
    var $ = cheerio.load(html);
    $(".latest-head").each(function(i, element) {

      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");
      var summary = $(element).next().text();

      if (title && link && summary) {
       var article = new Scraper({
         title: title,
         link: link,
         summary: summary
       });

        article.save(function(err, scrapedArticle){
          if (err){
            console.log("Error message");
            console.log(err);
          } else {
            console.log("Article saved");
            console.log(scrapedArticle);
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
