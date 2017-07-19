var express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Category = require('../models/category');

/* GET home page. */
router.get('/', (req, res, next) => {
  var userLogged = false;
  req.user ? userLogged = true : "";
  var user = req.user;
  Post.find({}, (err, posts) => {
    Category.find({}, (err, categories) => {
      if (err) { return next(err) };
      res.render('index', {
        posts: posts,categories:categories, userLogged,user
      });
    });
  });
});

//Search
router.get('/search', (req, res, next) => {
  var regularExpression = new RegExp(req.query.q);
  var userLogged = false;
  req.user ? userLogged = true : "";
  var user = req.user;

  Post.find( {"title" : { $regex: regularExpression, $options: 'i' }}, (err, posts) => {
    if (err) { return next(err) }
    res.render('posts/search', {
      posts: posts, userLogged, user
    });
  });
});

module.exports = router;
