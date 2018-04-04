const express = require("express");
const mongojs = require("mongojs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');

const api = require("./routes/api");
const article = require("./routes/article");
const saved = require("./routes/saved");
const scrape = require("./routes/scrape");
const Article = require("./models/Article");
const Note = require("./models/Note");

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/articleScraper");

app.get("/", function(req, res) {
  Article.find({saved: false})
    .then(function(articles) {
      res.render("index", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.use("/saved", saved);
app.use("/api", api);
app.use("/scrape", scrape);
app.use("/article", article);

app.listen(port, function() {
  console.log(`App running on port ${port}!`);
});
