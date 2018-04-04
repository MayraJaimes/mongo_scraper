const express     = require("express"),
      mongojs     = require("mongojs"),
      request     = require("request"),
      cheerio     = require("cheerio"),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      exphbs      = require('express-handlebars'),
      app         = express();

const api = require("./routes/api");

var port = process.env.PORT || 3000;

var Article = require("./models/Article");
var Note = require("./models/Note");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/articleScraper");

//ROUTES

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

app.get("/", function(req, res) {
  Article.find({saved: false})
    .then(function(articles) {
      res.render("index", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  Article.find({saved: true})
    .then(function(articles) {
      res.render("saved", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.use("/api", api);

app.get("/scrape", function(req, res) {  
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

app.get("/article/:id", function(req, res) {
  var id = req.params.id;
  console.log("id on server side", id)
  Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(article) {
      console.log(article.title);
      res.json(article);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/article/add/:id", function(req, res) {
  Note.create(req.body)
  .then(function(dbNote) {
    console.log("note", dbNote);
    return Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id} }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.listen(port, function() {
  console.log(`App running on port ${port}!`);
});
