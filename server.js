const express     = require("express"),
      mongojs     = require("mongojs"),
      request     = require("request"),
      cheerio     = require("cheerio"),
      bodyParser  = require("body-parser"),
      exphbs      = require('express-handlebars'),
      mongoose    = require('mongoose'),
      app         = express();
      
mongoose.connect("mongodb://localhost/mongoScraper");

var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

var scraperSchema = new mongoose.Schema({
  title: String,
  summary: String,
  link: String,
  comment: String,
  saved: {
    type: Boolean,
    default: false
  }
});

var Scraper = mongoose.model("Scraper", scraperSchema);


app.get("/", function(req, res) {
  console.log('on index')
  Scraper.find({saved: false}, function(err, articles) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('rendering index', articles);
      res.render("index", {articles: articles});
    }
  });
});

app.put("/api/saved", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: true};

  Scraper.findByIdAndUpdate(id, updateObj, function(err, updatedArticle){
    if(err){
      console.log(err);
    } else {
      res.render("index");
      console.log(updatedArticle);
    }
  })
});

app.put("/api/unsave", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: false};

  Scraper.findByIdAndUpdate(id, updateObj, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render("saved");
    }
  })
});

app.get("/saved", function(req, res) {
  Scraper.find({saved: true}, function(err, saved) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("saved", {saved: saved});
    }
  });
});
  
app.get("/scrape", function(req, res) {  
  var link = "https://www.sciencedaily.com/news/top/health/";
  request(link, function(error, response, html) {
    var $ = cheerio.load(html);
    $(".latest-head").each(function(i, element) {
      console.log('scraping latest news');
      var article = $(element).children("a").text();
      var link = $(element).children("a").attr("href");
      var summary = $(element).next().text();

      if (article && link && summary) {
        Scraper.find({title: article}, 
          function(err, docs) {
            if (docs.length === 0) {
              Scraper.create({
                title: article,
                link: link,
                summary: summary
              }, 
          function(err, docs) {
            if (err){
              console.log(err);
            } else {
              console.log("inserted");
            }
          });
          } else {
            console.log("already exists");
          }
        }
      )} 
    });
    
  })
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});
