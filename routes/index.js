var express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Category = require('../models/category');

/* GET home page. */
router.get('/', (req, res, next) => {
  Post.find({}, (err, posts) => {
    Category.find({}, (err, categories) => {
      if (err) { return next(err) };
      console.log("categories",categories)
       console.log("posts",posts)
      res.render('index', {
        posts: posts[0],categories:categories
      });
    });
  });
});

//Search
router.get('/search', (req, res, next) => {
  var regularExpression = new RegExp(req.query.q);

  Post.find( {"title" : { $regex: regularExpression, $options: 'i' }}, (err, posts) => {
    if (err) { return next(err) }
    res.render('posts/search', {
      posts: posts
    });
  });
});

module.exports = router;
