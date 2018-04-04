const express     = require("express"),
      mongojs     = require("mongojs"),
      request     = require("request"),
      cheerio     = require("cheerio"),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      exphbs      = require('express-handlebars'),
      app         = express();

var port = process.env.PORT || 3000;

var db = require("./models");

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
  db.Article.find({saved: false})
    .then(function(articles) {
      res.render("index", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  db.Article.find({saved: true})
    .then(function(articles) {
      res.render("saved", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.put("/api/saved", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: true};

  db.Article.findByIdAndUpdate(id, updateObj)
  .then(function(dbArticle) {
    // res.render("saved");
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});
  
app.put("/api/unsaved", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: false};

  db.Article.findByIdAndUpdate(id, updateObj)
  .then(function(dbArticle) {
    // res.render("saved");
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/scrape", function(req, res) {  
  request("https://www.sciencedaily.com/news/top/health/", function(error, response, html) {
    var $ = cheerio.load(html);
    const startScraping = async () => {
      await asyncForEach($(".latest-head"), async (element) => {
        var article = $(element).children("a").text();
        var link = "https://www.sciencedaily.com" + $(element).children("a").attr("href");
        var summary = $(element).next().clone().children().remove().end().text();
        if (article && link && summary) {
          let articles = await db.Article.find({title: article})
          let newArticle; 
          if (articles.length === 0) {
            newArticle = await db.Article.create({
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
  db.Article.findOne({_id: req.params.id})
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
  db.Note.create(req.body)
  .then(function(dbNote) {
    console.log("note", dbNote);
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id} }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
