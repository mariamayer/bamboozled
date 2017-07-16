var express = require('express');
var router = express.Router();
const Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    if (err) { return next(err) }
    res.render('index', {
      posts: posts
    });
  });
});

module.exports = router;
