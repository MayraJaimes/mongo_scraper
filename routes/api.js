const router = require("express").Router();
const Article = require("../models/Article");

router.put("/saved", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: true};

  Article.findByIdAndUpdate(id, updateObj)
  .then(function(dbArticle) {
    // res.render("saved");
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});
  
router.put("/unsaved", function(req, res) {
  var id = req.body.id;
  var updateObj = {saved: false};

  Article.findByIdAndUpdate(id, updateObj)
  .then(function(dbArticle) {
    // res.render("saved");
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

module.exports = router;