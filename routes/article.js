const router = require("express").Router();
const Article = require("../models/Article");
const Note = require("../models/Note");

router.get("/:id", function(req, res) {
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

router.post("/add/:id", function(req, res) {
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

module.exports = router;