var express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Category = require('../models/category');

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

//Render home
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    Category.find({}, (err, categories) => {
      if (err) { return next(err) };
      res.render('index', {
        posts: posts,categories:categories
      });
    });
  });
});

//Search
router.get('/search', (req, res, next) => {
  console.log(req.query.q)
  var regularExpression = new RegExp(req.query.q);
  console.log(regularExpression)
  Post.find( {"title" : { $regex: regularExpression, $options: 'i' }}, (err, posts) => {
    if (err) { return next(err) }
    res.render('posts/search', {
      posts: posts
    });
  });
});


router.get('/posts', auth, function (req, res, next) {

  res.render('posts/index', { message: req.flash('success') });
});

module.exports = router;
