var express = require('express');
var router = express.Router();
const Post = require('../models/post');

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    if (err) { return next(err) }
    res.render('index', {
      posts: posts
    });
  });
});


router.get('/posts', auth, function (req, res, next) {

  res.render('posts/index', { message: req.flash('success') });
});

module.exports = router;
