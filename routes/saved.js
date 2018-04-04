const router = require("express").Router();
const Article = require("../models/Article");

router.get("/", function(req, res) {
  Article.find({saved: true})
    .then(function(articles) {
      res.render("saved", {articles});  
    })
    .catch(function(err) {
      res.json(err);
    });
}); 

module.exports = router;