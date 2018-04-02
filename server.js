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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

var Scraper = mongoose.model("Scraper", scraperSchema);

app.get("/", function(req, res) {
  console.log('on index');
  Scraper.find({saved: false})
    .then((articles) => {
      console.log('articles', articles);
      res.render("index", {articles: articles});  
    })
    .catch(err => {
      console.log('Couldn\'t find any articles', err);
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
  request("https://www.sciencedaily.com/news/top/health/", function(error, response, html) {
    var $ = cheerio.load(html);
    const startScraping = async () => {
      await asyncForEach($(".latest-head"), async (element) => {
        var article = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
        var summary = $(element).next().text();
        if (article && link && summary) {
          let articles = await Scraper.find({title: article})
          let newArticle; 
          if (articles.length === 0) {
            newArticle = await Scraper.create({
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

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
